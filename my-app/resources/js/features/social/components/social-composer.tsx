import { RiSendPlaneLine } from '@remixicon/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface SocialComposerProps {
    disabled?: boolean;
    disabledReason?: string;
    sending?: boolean;
    error?: string | null;
    onSend: (body: string) => void;
}

/**
 * Reply composer — primary action. Prevents duplicate sends (disabled while
 * pending), preserves the draft on failure, and explains read-only state
 * instead of leaving a silent disabled composer (plan §106).
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
        <div className="border-t border-border p-3 flex flex-col gap-2">
            {disabled && disabledReason && (
                <p className="text-xs text-muted-foreground">{disabledReason}</p>
            )}

            <div className="flex items-end gap-2">
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
                    rows={2}
                    className="flex-1 resize-none"
                    disabled={disabled}
                    aria-label="Reply message"
                />
                <Button
                    type="button"
                    onClick={handleSend}
                    disabled={disabled || sending || draft.trim().length === 0}
                    aria-label="Send reply"
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

            {error && <p className="text-xs text-status-disconnected">{error}</p>}
        </div>
    );
}