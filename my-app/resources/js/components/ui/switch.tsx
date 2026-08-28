import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {}

/**
 * Canonical FLEX Switch — 24×14 track, 10px thumb, active #0077E6.
 * Tokens: --flex-switch-width / --flex-switch-height / --flex-switch-thumb / --flex-switch-active
 * Inactive track is theme-aware (border-border / muted), focus ring via flex-focus-visible.
 */
function Switch({ className, ...props }: SwitchProps) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            style={
                {
                    '--switch-width': 'var(--flex-switch-width)',
                    '--switch-height': 'var(--flex-switch-height)',
                } as React.CSSProperties
            }
            className={cn(
                'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-[var(--flex-duration-fast)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
                'h-[var(--flex-switch-height)] w-[var(--flex-switch-width)]',
                'data-[state=checked]:bg-[var(--flex-switch-active)] data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-white/20',
                'border-flex-workspace-divider',
                className
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    'pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform duration-[var(--flex-duration-fast)]',
                    'size-[10px]',
                    'data-[state=checked]:translate-x-[10px] data-[state=unchecked]:translate-x-[2px]'
                )}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
