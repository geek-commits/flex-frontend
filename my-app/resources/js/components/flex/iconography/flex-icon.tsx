import type React from 'react';
import { FLEX_ICON_REGISTRY } from '@/components/flex/iconography/registry';
import type { FlexIconName } from '@/components/flex/iconography/registry';
import { cn } from '@/lib/utils';

export type FlexIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const ICON_SIZE_CLASSES: Record<FlexIconSize, string> = {
    xs: 'size-[var(--flex-icon-size-xs)]',
    sm: 'size-[var(--flex-icon-size-sm)]',
    md: 'size-[var(--flex-icon-size-md)]',
    lg: 'size-[var(--flex-icon-size-lg)]',
    xl: 'size-[var(--flex-icon-size-xl)]',
};

export interface FlexIconProps extends React.SVGProps<SVGSVGElement> {
    name: FlexIconName;
    size?: FlexIconSize;
    /** Set when icon conveys meaning without adjacent visible text. */
    label?: string;
}

/** Shared semantic icon renderer for FLEX product surfaces. */
export function FlexIcon({ name, size = 'md', label, className, ...props }: FlexIconProps) {
    const Icon = FLEX_ICON_REGISTRY[name];

    return (
        <Icon
            className={cn(ICON_SIZE_CLASSES[size], className)}
            data-flex-icon={name}
            aria-hidden={label ? undefined : true}
            aria-label={label}
            focusable="false"
            {...props}
        />
    );
}
