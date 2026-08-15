import type React from 'react';
import { FLEX_ILLUSTRATION_REGISTRY } from '@/components/flex/iconography/illustration-registry';
import type { FlexIllustrationName } from '@/components/flex/iconography/illustration-registry';
import { cn } from '@/lib/utils';

/** Semantic cartoon illustration renderer for empty states, setup, and help. */
export function FlexIllustration({
    name,
    className,
    ...props
}: React.SVGProps<SVGSVGElement> & { name: FlexIllustrationName }) {
    const Illustration = FLEX_ILLUSTRATION_REGISTRY[name];

    return (
        <Illustration
            className={cn('size-[var(--flex-icon-size-illustration)]', className)}
            data-flex-illustration={name}
            aria-hidden="true"
            focusable="false"
            {...props}
        />
    );
}