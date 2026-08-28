import { useEffect, useRef, useState } from 'react';
import { StreamingText } from '@/components/vendor/aicss/streaming-text';
import type { TranscriptSegment } from './agent-assist-types';

interface AgentAssistTranscriptProps {
    segments: TranscriptSegment[];
}

export function AgentAssistTranscript({ segments }: AgentAssistTranscriptProps) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [showJump, setShowJump] = useState(false);

    useEffect(() => {
        const el = scrollerRef.current;

        if (!el) {
            return;
        }

        const onScroll = () => {
            const near = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
            setIsNearBottom(near);

            if (near) {
                setShowJump(false);
            }
        };

        el.addEventListener('scroll', onScroll, { passive: true });

        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (isNearBottom && scrollerRef.current) {
            scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
        } else {
            // New final arrived while user scrolled up — show jump affordance
            const hasFinal = segments.some((s) => s.status === 'final');

            if (hasFinal && !isNearBottom) {
                setShowJump(true);
            }
        }
    }, [segments, isNearBottom]);

    // Group consecutive segments by speaker for compact rendering
    const items = segments;

    if (items.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center px-4 py-8 text-center">
                <p className="text-xs text-flex-text-muted">Listening for conversation…</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-1 flex-col overflow-hidden">
            <div
                ref={scrollerRef}
                className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="Live transcript"
            >
                {items.map((seg) => {
                    const isCustomer = seg.speaker === 'customer';
                    // Show per-segment language only on code switch boundary
                    const prevIdx = items.findIndex((s) => s.id === seg.id) - 1;
                    const prev = prevIdx >= 0 ? items[prevIdx] : undefined;
                    const showLanguage = prev && prev.language.code !== seg.language.code;

                    return (
                        <div key={seg.id} className="space-y-1">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-medium uppercase tracking-wide text-flex-text-tertiary">
                                    {isCustomer ? 'Customer' : 'Agent'}
                                </span>
                                {showLanguage && (
                                    <span className="text-[11px] text-flex-text-tertiary">· {seg.language.label}</span>
                                )}
                                {seg.status === 'interim' && (
                                    <span className="text-[11px] text-flex-text-muted">(typing…)</span>
                                )}
                            </div>
                            <div
                                aria-live={seg.status === 'final' ? 'polite' : 'off'}
                                aria-atomic={seg.status === 'final' ? 'true' : undefined}
                            >
                                <StreamingText text={seg.text} interim={seg.status === 'interim'} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {showJump && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            if (scrollerRef.current) {
                                scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
                            }

                            setShowJump(false);
                        }}
                        className="rounded-full bg-card px-3 py-1 text-xs font-medium shadow-md border border-flex-workspace-divider"
                    >
                        Jump to live
                    </button>
                </div>
            )}
        </div>
    );
}
