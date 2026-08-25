import { ThinkingState } from '@/components/vendor/aicss/thinking-state';
import type { AssistLanguageState, AssistTransportState } from './agent-assist-types';

interface AgentAssistStatusProps {
    language: AssistLanguageState;
    transportState: AssistTransportState;
}

function transportLabel(state: AssistTransportState): { label: string; thinking?: boolean; live?: boolean; error?: boolean } | null {
    switch (state) {
        case 'connecting':
            return { label: 'Connecting…', thinking: true };
        case 'streaming':
            return { label: 'Live', live: true };
        case 'reconnecting':
            return { label: 'Reconnecting…', thinking: true };
        case 'stalled':
            return { label: 'Transcript delayed', error: true };
        case 'offline':
            return { label: 'Assist unavailable', error: true };
        case 'disconnected':
        default:
            return null;
    }
}

export function AgentAssistStatus({ language, transportState }: AgentAssistStatusProps) {
    const t = transportLabel(transportState);

    if (language.isDetecting) {
        return <ThinkingState label={language.label} />;
    }

    return (
        <span className="inline-flex items-center gap-1.5 text-xs">
            <span className="font-medium text-flex-text-primary">{language.label}</span>
            {t?.thinking && <ThinkingState label={t.label} className="text-[11px]" />}
            {t?.live && (
                <span className="inline-flex items-center gap-1 text-[11px] text-flex-text-muted" role="status" aria-label="Live">
                    <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                    {t.label}
                </span>
            )}
            {t?.error && <span className="text-[11px] text-amber-600">{t.label}</span>}
        </span>
    );
}
