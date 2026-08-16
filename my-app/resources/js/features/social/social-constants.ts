import type { SocialChannel, SocialChannelMeta } from './social-types';

/** Runtime-supported social channels (per manual + confirmed scope). */
export const SOCIAL_CHANNELS: SocialChannel[] = ['instagram', 'facebook', 'whatsapp'];

export const SOCIAL_CHANNEL_META: Record<SocialChannel, SocialChannelMeta> = {
    instagram: { id: 'instagram', label: 'Instagram' },
    facebook: { id: 'facebook', label: 'Facebook' },
    whatsapp: { id: 'whatsapp', label: 'WhatsApp' },
};

export type SocialChannelFilter = 'all' | SocialChannel;