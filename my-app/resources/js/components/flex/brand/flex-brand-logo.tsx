import React from 'react';
import { AnimatedFlexLogo } from '@/components/flex/brand/animated-flex-logo';
import { FlexBrandMark } from '@/components/flex/brand/flex-brand-mark';

export type FlexBrandVariant = 'sidebar' | 'collapsed' | 'auth' | 'static';

export interface FlexBrandLogoProps {
    className?: string;
    /** Decorative placement (next to visible FLEX text) — hides from screen readers. */
    decorative?: boolean;
    variant?: FlexBrandVariant;
    /** When false the logo renders static (completed) without construction. */
    animateOnMount?: boolean;
    style?: React.CSSProperties;
}

/** Production width per variant. Height is derived from the wordmark viewBox ratio. */
const VARIANT_WIDTH: Record<Exclude<FlexBrandVariant, 'collapsed'>, number> = {
    sidebar: 132,
    auth: 240,
    static: 160,
};

/** Responsive width override for auth — never overflows narrow screens (plan §27). */
const VARIANT_STYLE: Partial<Record<Exclude<FlexBrandVariant, 'collapsed'>, React.CSSProperties>> = {
    auth: { maxWidth: '68vw' },
};

const VARIANT_DURATION: Record<Exclude<FlexBrandVariant, 'collapsed'>, number> = {
    sidebar: 0.28,
    auth: 0.38,
    static: 0.28,
};

/** Compact monogram size for the collapsed sidebar brand. */
const MONOGRAM_SIZE = 30;

/**
 * Canonical production FLEX brand logo — the full FLEX wordmark.
 *
 * Owns production brand policy (plan §14–16): variant selection, sizing, the
 * full wordmark vs compact monogram choice, animation timing, and accessibility.
 *
 *   sidebar   → full wordmark (~132px), animates once on mount
 *   collapsed → official F monogram (~30px), static
 *   auth      → full wordmark (~240px, responsive), slower intro
 *   static    → full wordmark, no construction (completed frame)
 *
 * The resting/final frame is the literal source SVG. Geometry, fills and source
 * transforms come from flex-logo.original.svg and must never be altered (see
 * validate-flex-logo-source.py). Presentation framing is owned by
 * AnimatedFlexLogo's canonical viewBox.
 */
export function FlexBrandLogo({
    className = '',
    decorative = false,
    variant = 'sidebar',
    animateOnMount = true,
    style,
}: FlexBrandLogoProps) {
    if (variant === 'collapsed') {
        return <FlexBrandMark size={MONOGRAM_SIZE} standalone={!decorative} className={className} />;
    }

    return (
        <AnimatedFlexLogo
            className={className}
            style={{ width: VARIANT_WIDTH[variant], ...VARIANT_STYLE[variant], ...style }}
            animateOnMount={animateOnMount}
            replayOnHover={false}
            loop={false}
            durationScale={VARIANT_DURATION[variant]}
            ariaLabel={decorative ? undefined : 'FLEX'}
            aria-hidden={decorative ? true : undefined}
        />
    );
}