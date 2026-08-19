import { RiSendPlaneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface SocialComposerProps {
    disabled?: boolean;
    disabledReason?: string;
    sending?: boolean;
    error?: string | null;
    onSend: (body: string) => void;
}

/**
 * Reply composer — compact persistent control pinned to the bottom of the
 * conversation pane. Single-line default that expands with content
 * (field-sizing-content). White surface with a semantic border and focus ring;
 * Send is the FLEX primary action. Prevents duplicate sends (disabled while
 * pending), preserves the draft on failure, and explains read-only state
 * instead of leaving a silent disabled composer.
 */
export function SocialComposer({ disabled, disabledReason, sending, error, onSend }: SocialComposerProps) {
    const [draft, setDraft] = useState('');

    const handleSend = () => {
        const body = draft.trim();

        if (!body || disabled || sending) {
            return;
        }

        onSend(body);
        setDraft('');
    };

    return (
        <div className="border-t border-flex-workspace-divider p-3 flex flex-col gap-2">
            {disabled && disabledReason && (
                <p className="text-xs text-flex-text-muted">{disabledReason}</p>
            )}

            <div className="flex items-end gap-2">
                <div className="flex-1 rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface transition-shadow focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
                    <Textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a reply…"
                        rows={1}
                        className="min-h-[44px] max-h-32 border-0 bg-transparent px-3 py-2.5 text-sm focus-visible:ring-0 focus-visible:border-0"
                        disabled={disabled}
                        aria-label="Reply message"
                    />
                </div>
                <Button
                    type="button"
                    onClick={handleSend}
                    disabled={disabled || sending || draft.trim().length === 0}
                    aria-label="Send reply"
                    className={cn('h-11 shrink-0')}
                >
                    {sending ? (
                        <span className="flex items-center gap-1.5">
                            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Sending
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <RiSendPlaneLine className="size-4" />
                            Send
                        </span>
                    )}
                </Button>
            </div>

            {error && <p className="text-xs text-status-disconnected" role="alert">{error}</p>}
        </div>
    );
}