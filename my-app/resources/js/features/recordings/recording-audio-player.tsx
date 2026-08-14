import { RiPauseFill, RiPlayFill, RiVolumeUpLine } from '@remixicon/react';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export interface RecordingAudioPlayerProps {
    url?: string;
    duration?: string;
    compact?: boolean;
    name?: string;
}

export function RecordingAudioPlayer({ url, duration, compact = true, name }: RecordingAudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);

    if (!url) {
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

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setTotalDuration(audioRef.current.duration);
        }
    };

    const formatTime = (secs: number) => {
        if (Number.isNaN(secs) || secs <= 0) {
            return '0:00';
        }

        const mins = Math.floor(secs / 60);
        const remainingSecs = Math.floor(secs % 60);

        return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`flex items-center gap-2 ${compact ? '' : 'w-full'}`}>
            <audio
                ref={audioRef}
                src={url}
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => {
                    setPlaying(false);
                    setCurrentTime(0);
                }}
                onError={() => setPlaying(false)}
                className="hidden"
            />
            <Button
                type="button"
                variant="outline"
                size="icon-xs"
                aria-label={playing ? `Pause ${name ?? 'audio'}` : `Play ${name ?? 'audio'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                }}
                className="shrink-0 text-primary hover:text-primary"
            >
                {playing ? <RiPauseFill className="size-3.5" /> : <RiPlayFill className="size-3.5" />}
            </Button>

            {!compact && (
                <div className="flex flex-1 items-center gap-2">
                    <input
                        type="range"
                        min={0}
                        max={totalDuration || 100}
                        value={currentTime}
                        onChange={(e) => {
                            const time = Number(e.target.value);

                            if (audioRef.current) {
                                audioRef.current.currentTime = time;
                                setCurrentTime(time);
                            }
                        }}
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                    />
                    <span className="text-xs tabular-nums text-flex-text-muted shrink-0">
                        {formatTime(currentTime)} / {duration ?? formatTime(totalDuration)}
                    </span>
                    <RiVolumeUpLine className="size-4 text-flex-text-muted shrink-0" />
                </div>
            )}

            {compact && (
                <span className="text-xs tabular-nums text-flex-text-muted">
                    {playing ? formatTime(currentTime) : (duration ?? '0:00')}
                </span>
            )}
        </div>
    );
}
