import React from 'react';
import { FlexStatus } from '@/components/flex/flex-status';
import { SOCIAL_CHANNEL_META } from '../social-constants';
import type { SocialChannel } from '../social-types';

export interface ChannelBadgeProps {
    channel: SocialChannel;
}

/**
 * Channel identity badge — readable provider label (never color-only).
 * Provider identity is preserved by name; FLEX remains the product.
 */
export function ChannelBadge({ channel }: ChannelBadgeProps) {
    const meta = SOCIAL_CHANNEL_META[channel];

    return <FlexStatus tone="neutral">{meta.label}</FlexStatus>;
}