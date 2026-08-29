import type { DiagnosticsData } from '@/features/diagnostics/diagnostics-types';

/**
 * Deterministic Troubleshooting & Diagnostics mock dataset for the POC.
 *
 * POC MOCK — stable IDs and results (no `Math.random()`); replaces with the
 * real backend/telephony boundary behind `DiagnosticsRepository`. Diagnostic
 * thresholds, RTT/jitter figures, and SIP details are POC-defined samples and
 * are NOT runtime-verified telemetry. No network/device capability is faked as
 * verified.
 */

export const DIAGNOSTICS_MOCK: DiagnosticsData = {
    checks: [
        {
            id: 'network-connectivity',
            labelKey: 'diagnostics.checks.networkConnectivity.label',
            descriptionKey: 'diagnostics.checks.networkConnectivity.description',
            icon: 'routes',
            result: 'pass',
            detail: 'RTT: 28ms — signaling.flex.internal:443 reachable',
        },
        {
            id: 'webrtc-ice',
            labelKey: 'diagnostics.checks.webrtcIce.label',
            descriptionKey: 'diagnostics.checks.webrtcIce.description',
            icon: 'infrastructure',
            result: 'pass',
            detail: 'Host + SRFLX candidates gathered. TURN relay available.',
        },
        {
            id: 'sip-registration',
            labelKey: 'diagnostics.checks.sipRegistration.label',
            descriptionKey: 'diagnostics.checks.sipRegistration.description',
            icon: 'call-records',
            result: 'pass',
            detail: 'Registered as sip:1001@pbx.flex.internal — Expires in 3600s',
        },
        {
            id: 'microphone-permission',
            labelKey: 'diagnostics.checks.microphonePermission.label',
            descriptionKey: 'diagnostics.checks.microphonePermission.description',
            icon: 'tones',
            result: 'pass',
            detail: 'Permission: granted — Selected: Default Microphone',
        },
        {
            id: 'audio-codec',
            labelKey: 'diagnostics.checks.audioCodec.label',
            descriptionKey: 'diagnostics.checks.audioCodec.description',
            icon: 'tones',
            result: 'pass',
            detail: 'OPUS 48kHz stereo — Packet loss: 0.0%',
        },
        {
            id: 'bandwidth',
            labelKey: 'diagnostics.checks.bandwidth.label',
            descriptionKey: 'diagnostics.checks.bandwidth.description',
            icon: 'server-resources',
            result: 'pass',
            detail: 'Measured downlink: 45.2 Mbps — Minimum required: 0.1 Mbps',
        },
        {
            id: 'tls-certificate',
            labelKey: 'diagnostics.checks.tlsCertificate.label',
            descriptionKey: 'diagnostics.checks.tlsCertificate.description',
            icon: 'security',
            result: 'pass',
            detail: 'WSS TLS 1.3 — Certificate valid until 2027-01-15',
        },
        {
            id: 'jitter-buffer',
            labelKey: 'diagnostics.checks.jitterBuffer.label',
            descriptionKey: 'diagnostics.checks.jitterBuffer.description',
            icon: 'service-health',
            result: 'warn',
            detail: 'Jitter: 12ms (threshold: 10ms) — Packet loss: 0.2%',
        },
    ],
};