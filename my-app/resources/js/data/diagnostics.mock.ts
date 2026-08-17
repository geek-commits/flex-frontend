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
            label: 'Network Connectivity',
            description: 'TCP/IP reachability to Flex signaling server',
            icon: 'routes',
            result: 'pass',
            detail: 'RTT: 28ms — signaling.flex.internal:443 reachable',
        },
        {
            id: 'webrtc-ice',
            label: 'WebRTC ICE Candidates',
            description: 'ICE STUN/TURN connectivity and candidate gathering',
            icon: 'infrastructure',
            result: 'pass',
            detail: 'Host + SRFLX candidates gathered. TURN relay available.',
        },
        {
            id: 'sip-registration',
            label: 'SIP Registration',
            description: 'Agent SIP account registration on PBX',
            icon: 'call-records',
            result: 'pass',
            detail: 'Registered as sip:1001@pbx.flex.internal — Expires in 3600s',
        },
        {
            id: 'microphone-permission',
            label: 'Microphone Permission',
            description: 'Browser microphone access for audio input',
            icon: 'tones',
            result: 'pass',
            detail: 'Permission: granted — Selected: Default Microphone',
        },
        {
            id: 'audio-codec',
            label: 'Audio Codec (OPUS)',
            description: 'OPUS codec negotiation with remote endpoint',
            icon: 'tones',
            result: 'pass',
            detail: 'OPUS 48kHz stereo — Packet loss: 0.0%',
        },
        {
            id: 'bandwidth',
            label: 'Bandwidth Adequacy',
            description: 'Downlink speed for VoIP audio transmission',
            icon: 'server-resources',
            result: 'pass',
            detail: 'Measured downlink: 45.2 Mbps — Minimum required: 0.1 Mbps',
        },
        {
            id: 'tls-certificate',
            label: 'TLS / DTLS Security',
            description: 'Secure media transport (SRTP) and signaling (WSS)',
            icon: 'security',
            result: 'pass',
            detail: 'WSS TLS 1.3 — Certificate valid until 2027-01-15',
        },
        {
            id: 'jitter-buffer',
            label: 'Jitter & Packet Loss',
            description: 'Audio jitter buffer health and packet loss measurement',
            icon: 'service-health',
            result: 'warn',
            detail: 'Jitter: 12ms (threshold: 10ms) — Packet loss: 0.2%',
        },
    ],
};