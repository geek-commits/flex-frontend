import { RiFlag2Line, RiErrorWarningLine } from '@remixicon/react';
import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';

export interface FollowUpControlsProps {
    followUp: boolean;
    escalated: boolean;
    disabled?: boolean;
    onToggleFollowUp: () => void;
    onEscalate: () => void;
}

/**
 * Conversation follow-up tag and supervisor escalation. Toggles the follow-up
 * flag and escalates to a supervisor. Escalation uses the runtime contract;
 * consequence-aware, with confirmation handled at the workspace level.
 */
export function FollowUpControls({ followUp, escalated, disabled, onToggleFollowUp, onEscalate }: FollowUpControlsProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant={followUp ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleFollowUp}
                disabled={disabled}
                aria-pressed={followUp}
            >
                <RiFlag2Line className="size-4" />
                {followUp ? 'Follow-up set' : 'Mark follow-up'}
            </Button>

            <Button
                type="button"
                variant={escalated ? 'outline' : 'secondary'}
                size="sm"
                onClick={onEscalate}
                disabled={disabled || escalated}
            >
                <RiErrorWarningLine className="size-4" />
                {escalated ? 'Escalated' : 'Escalate'}
            </Button>

            {escalated && <FlexStatus tone="warning">Escalated to supervisor</FlexStatus>}
        </div>
    );
}