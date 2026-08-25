import { RiCloseLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';
import { TextResponse } from '@/components/vendor/aicss/text-response';
import type { AssistSuggestion } from './agent-assist-types';

interface AgentAssistSuggestionsProps {
    suggestions: AssistSuggestion[];
    onDismiss: (id: string) => void;
}

export function AgentAssistSuggestions({ suggestions, onDismiss }: AgentAssistSuggestionsProps) {
    if (suggestions.length === 0) {
        return null;
    }

    return (
        <div className="border-t border-flex-workspace-divider bg-flex-workspace-surface-muted px-3 py-3 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-flex-text-tertiary">Suggested</p>
            {suggestions.map((s) => (
                <div key={s.id} className="relative">
                    <TextResponse title={s.title} body={s.body} sourceLabel={s.sourceLabel} />
                    <div className="mt-2 flex justify-end gap-1.5">
                        <Button type="button" variant="ghost" size="sm" onClick={() => onDismiss(s.id)}>
                            <RiCloseLine className="size-3.5" />
                            Dismiss
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
