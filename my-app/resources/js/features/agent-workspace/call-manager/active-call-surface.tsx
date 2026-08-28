import {
    RiPhoneLine,
    RiArrowRightLine,
    RiCheckLine,
    RiMicLine,
    RiMicOffLine,
    RiPauseLine,
    RiPlayLine,
    RiSearchLine,
    RiSparklingLine,
    RiTeamLine,
    RiUserLine,
} from '@remixicon/react';
import { motion, useReducedMotion } from 'motion/react';
import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCallTimer } from '@/features/dashboard/use-call-timer';
import { cn } from '@/lib/utils';
import type { CallState } from '@/types/flex';
import { useAgentAssistSessionOptional } from '../agent-assist/agent-assist-session-context';
import {
    buildTransferTargets,
    filterTransferTargets,
} from '../state/transfer-targets';
import type { TransferTargetOption } from '../state/transfer-targets';
import type {
    ActiveCall,
    CallTarget,
    TransferState,
} from '../state/workspace-types';

export interface ActiveCallSurfaceProps {
    call: ActiveCall | null;
    callState: CallState;
    isMuted: boolean;
    isOnHold: boolean;
    transfer: TransferState | null;
    onToggleMute: () => void;
    onToggleHold: () => void;
    onTransfer: () => void;
    onSelectTransferTarget: (target: CallTarget) => void;
    onConfirmTransfer: () => void;
    onCancelTransfer: () => void;
    onDismissTransferFailure: () => void;
    onOpenAssist: () => void;
    onEnd: () => void;
}

const DURATION_STATES: CallState[] = ['connected', 'hold', 'transferring'];

const TRANSFER_TARGETS = buildTransferTargets();

/**
 * Active call surface (AGENT_WORKSPACE_PLAN §35–§39, §40–§44).
 *
 * Shows who the call is with, the current state, a connected-time timer
 * (isolated to this component — §36), and only the controls valid for the
 * current state. Transfer is contextual: entering it replaces the call
 * controls with target search/selection, then returns to the call (cancel or
 * failure) or ends the call (hand-off). Labels are explicit so agents never
 * memorize a row of ambiguous icons.
 */
export function ActiveCallSurface({
    call,
    callState,
    isMuted,
    isOnHold,
    transfer,
    onToggleMute,
    onToggleHold,
    onTransfer,
    onSelectTransferTarget,
    onConfirmTransfer,
    onCancelTransfer,
    onDismissTransferFailure,
    onOpenAssist,
    onEnd,
}: ActiveCallSurfaceProps) {
    const showTimer =
        DURATION_STATES.includes(callState) && Boolean(call?.connectedAt);
    const canToggleMedia = callState === 'connected' || callState === 'hold';
    const transferring = callState === 'transferring';
    const transferFailed = !transferring && transfer?.status === 'failed';
    const reduced = useReducedMotion();
    const assistSession = useAgentAssistSessionOptional();
    const isAssistOpen = !!assistSession?.isOpen;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex flex-col gap-3 border-b border-flex-workspace-divider bg-flex-workspace-surface-muted p-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-medium leading-[16px] text-foreground">
                            {call?.target.label ?? 'Unknown'}
                        </span>
                        {call?.target.phone && (
                            <span className="truncate font-mono text-xs text-muted-foreground">
                                {call.target.phone}
                            </span>
                        )}
                        {call?.queueLabel && (
                            <span className="mt-0.5 text-[10px] text-muted-foreground">
                                Inbound Queue: {call.queueLabel}
                            </span>
                        )}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-0.5">
                        {callState === 'dialing' && (
                            <span className="font-mono text-xs font-bold text-status-stale">
                                Calling…
                            </span>
                        )}
                        {callState === 'connecting' && (
                            <span className="font-mono text-xs font-bold text-status-stale">
                                Connecting…
                            </span>
                        )}
                        {(callState === 'connected' ||
                            callState === 'hold' ||
                            callState === 'transferring') &&
                            showTimer && (
                                <CallDuration connectedAt={call?.connectedAt} />
                            )}
                        {isOnHold && (
                            <span className="text-[10px] font-bold text-status-notready uppercase">
                                On Hold
                            </span>
                        )}
                        {isMuted && (
                            <span className="text-[10px] font-bold text-status-notready uppercase">
                                Muted
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {transferFailed && (
                <div
                    role="status"
                    className="flex items-center justify-between gap-2 border-b border-border bg-status-disconnected-bg/40 px-3 py-2 text-[11px] text-status-disconnected"
                >
                    <span className="font-semibold">
                        Transfer failed — you're still connected to the
                        customer.
                    </span>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={onDismissTransferFailure}
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {transferring && transfer ? (
                <TransferPanel
                    transfer={transfer}
                    customerLabel={call?.target.label}
                    onSelectTarget={onSelectTransferTarget}
                    onConfirm={onConfirmTransfer}
                    onCancel={onCancelTransfer}
                />
            ) : (
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant={isMuted ? 'secondary' : 'outline'}
                            onClick={onToggleMute}
                            disabled={!canToggleMedia}
                            aria-pressed={isMuted}
                            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                            className="gap-1.5 font-semibold"
                        >
                            {isMuted ? (
                                <motion.span
                                    key="mic-off"
                                    className="inline-flex"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: reduced ? 0 : 0.15,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <RiMicOffLine className="size-3.5" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="mic-on"
                                    className="inline-flex"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: reduced ? 0 : 0.15,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <RiMicLine className="size-3.5" />
                                </motion.span>
                            )}
                            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                        </Button>

                        <Button
                            variant={isOnHold ? 'secondary' : 'outline'}
                            onClick={onToggleHold}
                            disabled={!canToggleMedia}
                            aria-pressed={isOnHold}
                            aria-label={isOnHold ? 'Resume call' : 'Hold call'}
                            className="gap-1.5 font-semibold"
                        >
                            {isOnHold ? (
                                <motion.span
                                    key="resume"
                                    className="inline-flex"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: reduced ? 0 : 0.15,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <RiPlayLine className="size-3.5" />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="hold"
                                    className="inline-flex"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: reduced ? 0 : 0.15,
                                        ease: 'easeOut',
                                    }}
                                >
                                    <RiPauseLine className="size-3.5" />
                                </motion.span>
                            )}
                            <span>{isOnHold ? 'Resume' : 'Hold'}</span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={onTransfer}
                            disabled={callState !== 'connected'}
                            title={
                                callState === 'hold'
                                    ? 'Resume the call to transfer'
                                    : undefined
                            }
                            className="gap-1.5 font-semibold"
                        >
                            <RiArrowRightLine className="size-3.5" />
                            <span>Transfer</span>
                        </Button>

                        <Button
                            variant={isAssistOpen ? 'secondary' : 'outline'}
                            onClick={onOpenAssist}
                            disabled={!canToggleMedia}
                            className="gap-1.5 font-semibold"
                            aria-pressed={isAssistOpen}
                            aria-label={isAssistOpen ? 'Minimize Assist' : 'Open Assist'}
                        >
                            <RiSparklingLine className="size-3.5" />
                            <span>{isAssistOpen ? 'Hide Assist' : 'Assist'}</span>
                        </Button>
                    </div>
                </div>
            )}

            <div className="border-t border-border p-3">
                <Button
                    variant="destructive"
                    onClick={onEnd}
                    className="w-full gap-1.5 font-semibold"
                    aria-label="End call"
                >
                    <RiPhoneLine className="size-3.5" />
                    <span>End Call</span>
                </Button>
            </div>
        </div>
    );
}

interface TransferPanelProps {
    transfer: TransferState;
    customerLabel?: string;
    onSelectTarget: (target: CallTarget) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

function TransferPanel({
    transfer,
    customerLabel,
    onSelectTarget,
    onConfirm,
    onCancel,
}: TransferPanelProps) {
    if (transfer.status === 'pending') {
        return (
            <div
                role="status"
                className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center"
            >
                <div className="flex items-center gap-2 rounded-md bg-status-stale-bg px-3 py-2 text-[11px] text-status-stale">
                    <RiArrowRightLine className="size-3.5" />
                    <span className="font-semibold">
                        Transferring to {transfer.target?.label}…
                    </span>
                </div>
                <p className="text-xs text-muted-foreground">
                    Your call will disconnect once the transfer completes.
                </p>
                <Button variant="outline" size="sm" onClick={onCancel}>
                    Cancel Transfer
                </Button>
            </div>
        );
    }

    return (
        <TransferTargetPicker
            transfer={transfer}
            customerLabel={customerLabel}
            onSelectTarget={onSelectTarget}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
}

interface TransferTargetPickerProps {
    transfer: TransferState;
    customerLabel?: string;
    onSelectTarget: (target: CallTarget) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

function TransferTargetPicker({
    transfer,
    customerLabel,
    onSelectTarget,
    onConfirm,
    onCancel,
}: TransferTargetPickerProps) {
    const [query, setQuery] = useState('');
    const filtered = useMemo(
        () => filterTransferTargets(TRANSFER_TARGETS, query),
        [query],
    );
    const selected = transfer.target;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-col gap-2 border-b border-border p-3">
                <label
                    htmlFor="transfer-target-search"
                    className="text-[11px] font-semibold text-muted-foreground"
                >
                    Transfer to
                </label>
                <div className="relative">
                    <RiSearchLine className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="transfer-target-search"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search agents and queues"
                        className="pl-8"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {filtered.agents.length === 0 &&
                filtered.queues.length === 0 ? (
                    <p className="p-3 text-xs text-muted-foreground">
                        No matching agents or queues.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filtered.agents.length > 0 && (
                            <section aria-labelledby="transfer-target-agents">
                                <h3
                                    id="transfer-target-agents"
                                    className="px-2 pb-1 text-[10px] font-bold tracking-wide text-muted-foreground uppercase"
                                >
                                    Agents
                                </h3>
                                <ul className="flex flex-col gap-0.5">
                                    {filtered.agents.map((option) => (
                                        <li key={option.target.id}>
                                            <TargetRow
                                                option={option}
                                                selected={
                                                    selected?.id ===
                                                    option.target.id
                                                }
                                                onSelect={() =>
                                                    onSelectTarget(
                                                        option.target,
                                                    )
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                        {filtered.queues.length > 0 && (
                            <section aria-labelledby="transfer-target-queues">
                                <h3
                                    id="transfer-target-queues"
                                    className="px-2 pb-1 text-[10px] font-bold tracking-wide text-muted-foreground uppercase"
                                >
                                    Queues
                                </h3>
                                <ul className="flex flex-col gap-0.5">
                                    {filtered.queues.map((option) => (
                                        <li key={option.target.id}>
                                            <TargetRow
                                                option={option}
                                                selected={
                                                    selected?.id ===
                                                    option.target.id
                                                }
                                                onSelect={() =>
                                                    onSelectTarget(
                                                        option.target,
                                                    )
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>
                )}
            </div>

            <div className="flex shrink-0 flex-col gap-2 border-t border-border p-3">
                <p className="text-[10px] leading-snug text-muted-foreground">
                    {selected
                        ? `Direct transfer to ${selected.label} will end your call with ${
                              customerLabel ?? 'the customer'
                          }.`
                        : 'Select an agent or queue, then confirm the transfer.'}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={onConfirm}
                        disabled={!selected}
                    >
                        Transfer
                    </Button>
                </div>
            </div>
        </div>
    );
}

function TargetRow({
    option,
    selected,
    onSelect,
}: {
    option: TransferTargetOption;
    selected: boolean;
    onSelect: () => void;
}) {
    const isAgent = option.target.kind === 'agent';

    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={!option.reachable}
            aria-pressed={selected}
            className={cn(
                'flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors outline-none',
                'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30',
                'disabled:pointer-events-none disabled:opacity-50',
                selected
                    ? 'bg-primary/10 text-foreground'
                    : 'text-foreground hover:bg-muted',
            )}
        >
            <span className="flex min-w-0 items-center gap-2">
                {isAgent ? (
                    <RiUserLine className="size-3.5 shrink-0 text-muted-foreground" />
                ) : (
                    <RiTeamLine className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="truncate font-semibold">
                    {option.target.label}
                </span>
                {isAgent && option.extension && (
                    <span className="font-mono text-[10px] text-muted-foreground">
                        {option.extension}
                    </span>
                )}
            </span>
            <span className="flex shrink-0 items-center gap-2">
                {isAgent && option.queue && (
                    <span className="max-w-28 truncate text-[10px] text-muted-foreground">
                        {option.queue}
                    </span>
                )}
                {option.reachable && selected && (
                    <RiCheckLine className="size-3.5 text-primary" />
                )}
                {!option.reachable && (
                    <span className="text-[10px] font-semibold text-status-notready">
                        {option.stateLabel ?? 'Unavailable'}
                    </span>
                )}
            </span>
        </button>
    );
}

function CallDuration({ connectedAt }: { connectedAt?: string }) {
    const duration = useCallTimer(connectedAt ?? new Date().toISOString());

    return (
        <span className="font-mono text-xs font-bold text-primary">
            {duration}
        </span>
    );
}
