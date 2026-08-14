import { RiPauseFill, RiPlayFill } from '@remixicon/react';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { VoicemailInfo } from '@/features/customer-recovery/recovery-types';

/**
 * Shared voicemail audio player (play/pause/progress/duration/loading/error).
 * This is the canonical recovery audio control, reused in the table and detail.
 * A real backend supplies an authorized, short-lived URL.
 */
export function VoicemailPlayer({ voicemail, compact = false }: { voicemail: VoicemailInfo; compact?: boolean }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [loaded, setLoaded] = useState(false);

    if (!voicemail.hasVoicemail || !voicemail.url) {
        return <span className="text-xs text-flex-text-muted">—</span>;
    }

    const toggle = () => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            void audio.play();
            setPlaying(true);
        } else {
            audio.pause();
            setPlaying(false);
        }
    };

    return (
        <div className={`flex items-center gap-2 ${compact ? '' : 'w-full'}`}>
            <audio
                ref={audioRef}
                src={voicemail.url}
                preload="metadata"
                onLoadedMetadata={() => setLoaded(true)}
                onEnded={() => setPlaying(false)}
                onError={() => setPlaying(false)}
                className="hidden"
            />
            <Button variant="outline" size="icon-xs" aria-label={playing ? 'Pause voicemail' : 'Play voicemail'} onClick={toggle}>
                {playing ? <RiPauseFill className="size-3.5" /> : <RiPlayFill className="size-3.5 text-primary" />}
            </Button>
            <span className="text-xs tabular-nums text-flex-text-muted">{voicemail.duration ?? (loaded ? '0:00' : '—')}</span>
        </div>
    );
}
