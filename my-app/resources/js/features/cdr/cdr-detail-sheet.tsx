import { router } from '@inertiajs/react';
import { RiExternalLinkLine, RiPlayFill, RiPauseLine } from '@remixicon/react';
import { useState } from 'react';
import { FlexDetailSheet } from '@/components/flex/flex-detail-sheet';
import { FlexStatus } from '@/components/flex/flex-status';
import { Button } from '@/components/ui/button';
import { getCallTimeline } from '@/data/cdr-events.mock';
import { cdrRepository } from '@/domain/cdr-repository';
import type { CDRRecord } from '@/domain/types';
import { CDR_STATUS_TONE, formatDuration } from '@/features/cdr/cdr-columns';

export interface CdrDetailSheetProps {
    recordId?: string;
    onOpenChange: (open: boolean) => void;
}

export function CdrDetailSheet({ recordId, onOpenChange }: CdrDetailSheetProps) {
    const [record, setRecord] = useState<CDRRecord>();
    const [loadedId, setLoadedId] = useState<string>();
    const open = !!recordId;
    const [playing, setPlaying] = useState(false);

    if (recordId && recordId !== loadedId) {
        setLoadedId(recordId);
        const found = cdrRepository.getById(recordId);

        if (found) {
            setRecord(found);
        }
    }

    return (
        <FlexDetailSheet
            open={open}
            onOpenChange={onOpenChange}
            title={record?.customerPhone ?? 'Call detail'}
            meta={
                record ? (
                    <div className="flex items-center gap-2">
                        <FlexStatus tone={CDR_STATUS_TONE[record.status]} className="capitalize">
                            {record.status}
                        </FlexStatus>
                        <span>{record.date}</span>
                    </div>
                ) : undefined
            }
            footer={
                <>
                    {record && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs text-muted-foreground"
                            onClick={() => router.visit(`/admin/cdr/${record.id}`)}
                        >
                            <RiExternalLinkLine className="size-3.5" />
                            Full detail
                        </Button>
                    )}
                </>
            }
        >
            {record ? (
                <>
                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Queue</span>
                            <span className="text-sm font-semibold text-foreground truncate">{record.queueName}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Agent</span>
                            <span className="text-sm font-semibold text-foreground truncate">{record.agentName}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Duration</span>
                            <span className="text-sm font-semibold text-foreground font-mono flex-numeric">
                                {formatDuration(record.durationSeconds)}
                            </span>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                            <span className="text-[10px] uppercase font-semibold text-muted-foreground">Recording</span>
                            <span className="text-sm font-semibold text-foreground">
                                {record.hasRecording ? 'Available' : 'No recording'}
                            </span>
                        </div>
                    </div>

                    {/* Recording player (mock) */}
                    {record.hasRecording && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon-sm"
                                title={playing ? 'Pause' : 'Play'}
                                onClick={() => setPlaying((p) => !p)}
                            >
                                {playing ? (
                                    <RiPauseLine className="size-4" />
                                ) : (
                                    <RiPlayFill className="size-4 text-primary" />
                                )}
                            </Button>
                            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div className={`h-full bg-primary rounded-full transition-all ${playing ? 'w-2/3' : 'w-0'}`} />
                            </div>
                            <span className="font-mono text-xs text-muted-foreground flex-numeric">
                                {formatDuration(record.durationSeconds)}
                            </span>
                        </div>
                    )}

                    {/* Call timeline */}
                    <div className="flex flex-col gap-0">
                        {getCallTimeline(record).map((event, index, all) => {
                            const eventTone = {
                                live: 'bg-status-live',
                                stale: 'bg-status-stale',
                                disconnected: 'bg-status-disconnected',
                                talking: 'bg-status-talking',
                                neutral: 'bg-status-notready',
                            }[event.tone];

                            return (
                                <div key={event.id} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className={`mt-1 size-2 rounded-full ${eventTone}`} aria-hidden="true" />
                                        {index < all.length - 1 && <span className="w-px flex-1 bg-border" />}
                                    </div>
                                    <div className={`pb-4 min-w-0 ${index === all.length - 1 ? 'pb-0' : ''}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[11px] text-muted-foreground flex-numeric">{event.at}</span>
                                            <span className="text-xs font-semibold text-foreground">{event.title}</span>
                                        </div>
                                        {event.description && (
                                            <p className="text-[11px] text-muted-foreground mt-0.5">{event.description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <p className="text-xs text-flex-text-muted">Call record not found.</p>
            )}
        </FlexDetailSheet>
    );
}
