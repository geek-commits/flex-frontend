import React, { useEffect, useRef } from 'react';
import { FlexBrandSvg } from '@/components/flex/brand/flex-brand-svg';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * Centralized brand motion timing.
 *
 * BRAND MOTION TOKENS — distinct from normal product motion tokens. Brand
 * construction is allowed to be slightly longer than standard UI motion, but it
 * must not feel like a splash-screen intro.
 */
const LOGO_MOTION = {
    foundation: 360,
    topArm: 320,
    middleArm: 300,
    accent: 220,
    settle: 240,
    armStagger: 70,
} as const;

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const SETTLE_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export interface FlexBrandMarkProps {
    className?: string;
    size?: number;
    standalone?: boolean;
    animateOnMount?: boolean;
    animateOnHover?: boolean;
}

interface BrandPart {
    el: SVGElement | null;
    base: { opacity: string; scale?: string; translate?: string };
    final: { opacity: string; scale?: string; translate?: string };
}

/**
 * Canonical animated FLEX brand mark.
 *
 * Uses the Web Animations API directly (no animation library) and animates only
 * transform/opacity so no layout recalculation occurs. Constructs once on mount
 * and stays idle; hover replay is opt-in. Respects prefers-reduced-motion and
 * cleans up all animations/timers on unmount.
 */
export function FlexBrandMark({
    className = '',
    size = 24,
    standalone = true,
    animateOnMount = true,
    animateOnHover = false,
}: FlexBrandMarkProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const animationsRef = useRef<Animation[]>([]);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const playingRef = useRef(false);
    const reducedMotion = useReducedMotion();

    const registerTimer = (timer: ReturnType<typeof setTimeout>) => {
        timersRef.current.push(timer);
    };

    const cancelAnimations = () => {
        animationsRef.current.forEach((animation) => animation.cancel());
        animationsRef.current = [];
        timersRef.current.forEach((timer) => clearTimeout(timer));
        timersRef.current = [];
    };

    const collectParts = (): BrandPart[] => {
        const svg = svgRef.current;

        if (!svg) {
            return [];
        }

        const find = (name: string) => svg.querySelector<SVGElement>(`[data-brand-part="${name}"]`);

        const parts: BrandPart[] = [
            {
                el: find('foundation'),
                base: { opacity: '0', scale: '0.9' },
                final: { opacity: '1', scale: '1' },
            },
            {
                el: find('top-arm'),
                base: { opacity: '0', scale: '0.08 1' },
                final: { opacity: '1', scale: '1' },
            },
            {
                el: find('middle-arm'),
                base: { opacity: '0', scale: '0.08 1' },
                final: { opacity: '1', scale: '1' },
            },
            {
                el: find('accent'),
                base: { opacity: '0', scale: '1.08', translate: '2px -2px' },
                final: { opacity: '1', scale: '1', translate: '0px 0px' },
            },
        ];

        return parts;
    };

    const applyState = (parts: BrandPart[], state: 'base' | 'final') => {
        parts.forEach((part) => {
            if (!part.el) {
                return;
            }

            part.el.style.opacity = part[state].opacity;

            if (part[state].scale) {
                part.el.style.scale = part[state].scale;
            }

            if (part[state].translate) {
                part.el.style.translate = part[state].translate;
            }
        });
    };

    const animatePart = (part: BrandPart, duration: number, easing = EASE) => {
        if (!part.el) {
            return Promise.resolve();
        }

        const from: Record<string, string> = { opacity: part.base.opacity };
        const to: Record<string, string> = { opacity: part.final.opacity };

        if (part.base.scale) {
            from.scale = part.base.scale;
        }

        if (part.final.scale) {
            to.scale = part.final.scale;
        }

        if (part.base.translate) {
            from.translate = part.base.translate;
        }

        if (part.final.translate) {
            to.translate = part.final.translate;
        }

        const animation = part.el.animate([from, to], { duration, easing, fill: 'forwards' });

        animationsRef.current.push(animation);

        return animation.finished.catch(() => undefined);
    };

    const play = async () => {
        if (playingRef.current) {
            return;
        }

        playingRef.current = true;
        cancelAnimations();

        const svg = svgRef.current;
        const parts = collectParts();

        applyState(parts, 'base');

        if (svg) {
            svg.style.transform = 'scale(1)';
        }

        if (reducedMotion) {
            applyState(parts, 'final');
            playingRef.current = false;

            return;
        }

        // foundation
        await animatePart(parts[0], LOGO_MOTION.foundation);

        // top arm
        await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, LOGO_MOTION.armStagger);

            registerTimer(timer);
        });
        void animatePart(parts[1], LOGO_MOTION.topArm);

        // middle arm
        await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, LOGO_MOTION.armStagger);
            registerTimer(timer);
        });
        await animatePart(parts[2], LOGO_MOTION.middleArm);

        // accent
        await new Promise<void>((resolve) => {
            const timer = setTimeout(resolve, 80);
            registerTimer(timer);
        });
        await animatePart(parts[3], LOGO_MOTION.accent);

        // subtle finishing settle
        if (svg) {
            const settle = svg.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.008)' },
                    { transform: 'scale(1)' },
                ],
                { duration: LOGO_MOTION.settle, easing: SETTLE_EASE, fill: 'forwards' }
            );

            animationsRef.current.push(settle);
            await settle.finished.catch(() => undefined);
        }

        applyState(parts, 'final');
        playingRef.current = false;
    };

    // Construct once on mount.
    useEffect(() => {
        if (!animateOnMount) {
            return;
        }

        void play();

        return () => {
            cancelAnimations();
            playingRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animateOnMount]);

    // On unmount, cancel everything.
    useEffect(() => {
        return () => {
            cancelAnimations();
            playingRef.current = false;
        };
    }, []);

    return (
        <div
            className={`flex items-center gap-2.5 ${className}`}
            style={{ contain: 'layout paint' }}
            onPointerEnter={animateOnHover ? () => void play() : undefined}
        >
            <FlexBrandSvg
                ref={svgRef}
                standalone={standalone}
                width={size}
                height={size}
                style={{ display: 'block' }}
            />
        </div>
    );
}
