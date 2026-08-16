import React from 'react';
import { AnimatedFlexLogo } from '@/components/flex/brand/animated-flex-logo';

export type FlexBrandVariant = 'app' | 'login';

export interface FlexBrandLogoProps {
    className?: string;
    /** Decorative placement (next to visible FLEX text) — hides from screen readers. */
    decorative?: boolean;
    variant?: FlexBrandVariant;
    /** When false the logo renders static (completed) without construction. */
    animateOnMount?: boolean;
    /** Display width in px. The wordmark aspect ratio (~2.27:1) sets the height. */
    width?: number;
    style?: React.CSSProperties;
}

/**
 * Canonical production FLEX brand logo — the full FLEX wordmark.
 *
 * Centralizes production brand policy (plan §37, §38): full wordmark, animate
 * once on mount, hover replay off, loop off, short operational timing. Auth and
 * marketing surfaces may opt into the longer `login` variant.
 *
 * The resting/final frame is the literal source SVG. Geometry, fills and source
 * transforms come from flex-logo.original.svg and must never be altered (see
 * validate-flex-logo-source.py).
 */
export function FlexBrandLogo({
    className = '',
    decorative = false,
    variant = 'app',
    animateOnMount = true,
    width = 160,
    style,
}: FlexBrandLogoProps) {
    const durationScale = variant === 'login' ? 0.38 : 0.28;

    return (
        <AnimatedFlexLogo
            className={className}
            style={{ width, ...style }}
            animateOnMount={animateOnMount}
            replayOnHover={false}
            loop={false}
            durationScale={durationScale}
            ariaLabel={decorative ? undefined : 'FLEX'}
            aria-hidden={decorative ? true : undefined}
        />
    );
}