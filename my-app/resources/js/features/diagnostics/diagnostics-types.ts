import type { FlexIconName } from '@/components/flex/iconography';

export type DiagnosticResult = 'pass' | 'warn' | 'fail' | 'pending';

export interface DiagnosticCheck {
    id: string;
    label: string;
    description: string;
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