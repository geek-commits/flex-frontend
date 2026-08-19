import React from 'react';
import { SocialChannelIcon } from '@/components/flex/social/social-channel-icon';
import { cn } from '@/lib/utils';
import { SOCIAL_CHANNELS, SOCIAL_CHANNEL_META } from '../social-constants';
import type { SocialChannelFilter } from '../social-constants';
import type { SocialChannel } from '../social-types';

export interface SocialChannelFilterProps {
    value: SocialChannelFilter;
    onChange: (value: SocialChannelFilter) => void;
}

const CHIP_CLASSES =
    'inline-flex h-7 items-center gap-1.5 rounded-md px-3 text-[13px] font-medium transition-colors duration-[var(--flex-duration-fast)]';

/**
 * Compact channel filter (FLEX filter spec: 28px height, Inter 13/16, 500
 * Medium, 6px radius). Selected uses the FLEX primary blue treatment;
 * unselected is quiet neutral/white. Provider brand colors stay inside the
 * provider icons (§29) — never as filter backgrounds.
 */
export function SocialChannelFilter({ value, onChange }: SocialChannelFilterProps) {
    const chip = (active: boolean) =>
        cn(
            CHIP_CLASSES,
            active
                ? 'bg-primary text-primary-foreground'
                : 'text-flex-text-muted hover:bg-flex-workspace-surface-muted',
        );

    return (
        <div
            role="group"
            aria-label="Filter by channel"
            className="flex items-center gap-1 overflow-x-auto"
        >
            <button
                type="button"
                onClick={() => onChange('all')}
                aria-pressed={value === 'all'}
                className={chip(value === 'all')}
            >
                All
            </button>
            {SOCIAL_CHANNELS.map((channel: SocialChannel) => (
                <button
                    key={channel}
                    type="button"
                    onClick={() => onChange(channel)}
                    aria-pressed={value === channel}
                    className={chip(value === channel)}
                >
                    <SocialChannelIcon channel={channel} className="size-4" />
                    <span className="hidden sm:inline">
                        {SOCIAL_CHANNEL_META[channel].label}
                    </span>
                </button>
            ))}
        </div>
    );
}