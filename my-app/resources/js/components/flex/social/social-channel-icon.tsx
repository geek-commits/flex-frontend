import { RiMessageLine } from '@remixicon/react';
import type { SocialChannel } from '@/features/social/social-types';
import { cn } from '@/lib/utils';
import FacebookIcon from '@assets/social/facebook.svg?react';
import InstagramIcon from '@assets/social/instagram.svg?react';
import WhatsAppIcon from '@assets/social/whatsapp.svg?react';

/**
 * Social provider identity icons. A deliberate exception to the FLEX semantic
 * icon system: approved provider brand marks carry their own recognizable
 * colors. Never spread these into unrelated FLEX navigation — they identify
 * the *channel* a conversation came from.
 *
 * The provider logo alone is not an accessible name; callers must pair it
 * with visible text or an aria-label (see ConversationRow / ConversationHeader).
 */
const CHANNEL_ICONS: Record<
    SocialChannel,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    whatsapp: WhatsAppIcon,
};

export interface SocialChannelIconProps {
    channel: SocialChannel | string;
    className?: string;
}

export function SocialChannelIcon({
    channel,
    className,
}: SocialChannelIconProps) {
    const Icon = CHANNEL_ICONS[channel as SocialChannel];

    if (!Icon) {
        return (
            <RiMessageLine
                className={cn('size-4', className)}
                aria-hidden="true"
            />
        );
    }

    return (
        <Icon className={cn('size-4 shrink-0', className)} aria-hidden="true" />
    );
}
