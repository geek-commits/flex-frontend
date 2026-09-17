import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface AccountAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
    src?: string | null;
    name?: string;
    initials: string;
    alt?: string;
}

/**
 * Canonical signed-in account/profile avatar.
 * - Has photo → show photo unchanged
 * - No photo → initials on layered account gradient (blue/cyan/violet/magenta), white text with shadow
 * Scope: global account/profile control only. Never use for agent/customer/wallboard/generic avatars.
 */
export function AccountAvatar({ src, initials, alt, className, size = 'default', ...props }: AccountAvatarProps & { size?: 'default' | 'sm' | 'lg' }) {
    return (
        <Avatar size={size} className={className} {...props}>
            {src ? <AvatarImage src={src} alt={alt ?? ''} /> : null}
            <AvatarFallback
                style={
                    {
                        background: 'var(--flex-account-avatar-gradient)',
                        color: '#FFFFFF',
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.28)',
                    } as React.CSSProperties
                }
            >
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}
