import type { FlexIconName } from '@/components/flex/iconography';

export type DiagnosticResult = 'pass' | 'warn' | 'fail' | 'pending';

export type DiagnosticsLabelKey =
    | 'diagnostics.checks.networkConnectivity.label'
    | 'diagnostics.checks.webrtcIce.label'
    | 'diagnostics.checks.sipRegistration.label'
    | 'diagnostics.checks.microphonePermission.label'
    | 'diagnostics.checks.audioCodec.label'
    | 'diagnostics.checks.bandwidth.label'
    | 'diagnostics.checks.tlsCertificate.label'
    | 'diagnostics.checks.jitterBuffer.label';
export type DiagnosticsDescriptionKey =
    | 'diagnostics.checks.networkConnectivity.description'
    | 'diagnostics.checks.webrtcIce.description'
    | 'diagnostics.checks.sipRegistration.description'
    | 'diagnostics.checks.microphonePermission.description'
    | 'diagnostics.checks.audioCodec.description'
    | 'diagnostics.checks.bandwidth.description'
    | 'diagnostics.checks.tlsCertificate.description'
    | 'diagnostics.checks.jitterBuffer.description';

export interface DiagnosticCheck {
    id: string;
    labelKey: DiagnosticsLabelKey;
    descriptionKey: DiagnosticsDescriptionKey;
    icon: FlexIconName;
    result: DiagnosticResult;
    detail?: string;
}

export interface DiagnosticsData {
    checks: DiagnosticCheck[];
}

export interface DeviceSelection {
    micDevice: string;
    speakerDevice: string;
}