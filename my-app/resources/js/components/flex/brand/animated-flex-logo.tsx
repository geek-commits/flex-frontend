import React, {
    forwardRef,
    useCallback,
    useEffect,
    useId,
    useImperativeHandle,
    useLayoutEffect,
    useMemo,
    useRef,
} from 'react';
import './animated-flex-logo.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const INTRO_END = 5.2;
const LOOP_END = 8.15;

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_OUT_FAST = 'cubic-bezier(0.16, 1, 0.3, 1)';
const REVERSE_EASE = 'cubic-bezier(0.64, 0, 0.78, 0)';

export interface FlexLogoHandle {
    play: () => void;
    pause: () => void;
    resume: () => void;
    restart: () => void;
    stop: () => void;
}

interface PieceConfig {
    start: number;
    end: number;
    reverseStart: number;
    reverseEnd: number;
    origin: string;
    fromTranslate: string;
    fromScale: number;
    ease: string;
    overshoot?: number;
}

type KeyframeFrame = Keyframe & {
    translate?: string;
    scale?: string;
    offset: number;
    easing?: string;
};

// Timeline values are seconds and intentionally mirror the supplied motion brief.
const PIECES: Record<string, PieceConfig> = {
    'flex-f-main': {
        start: 0.5,
        end: 1.1,
        reverseStart: 7.05,
        reverseEnd: 7.85,
        origin: '0% 62%',
        fromTranslate: '-3% 1%',
        fromScale: 0.95,
        ease: EASE_OUT,
    },
    'flex-l-main': {
        start: 0.65,
        end: 1.35,
        reverseStart: 6.85,
        reverseEnd: 7.55,
        origin: '48% 100%',
        fromTranslate: '0% -3%',
        fromScale: 0.955,
        ease: EASE_OUT,
    },
    'flex-e-main': {
        start: 0.85,
        end: 1.6,
        reverseStart: 6.65,
        reverseEnd: 7.3,
        origin: '12% 52%',
        fromTranslate: '-2.5% 0%',
        fromScale: 0.96,
        ease: EASE_OUT_FAST,
    },
    'flex-x-main': {
        start: 1.0,
        end: 1.75,
        reverseStart: 6.45,
        reverseEnd: 7.1,
        origin: '15% 50%',
        fromTranslate: '3% 0%',
        fromScale: 0.96,
        ease: EASE_OUT_FAST,
    },
    'flex-f-secondary': {
        start: 1.4,
        end: 2.05,
        reverseStart: 6.15,
        reverseEnd: 6.55,
        origin: '8% 35%',
        fromTranslate: '-2% 1%',
        fromScale: 0.97,
        ease: EASE_OUT_FAST,
    },
    'flex-l-detail': {
        start: 1.5,
        end: 2.15,
        reverseStart: 6.05,
        reverseEnd: 6.4,
        origin: '45% 75%',
        fromTranslate: '0% -2.5%',
        fromScale: 0.97,
        ease: EASE_OUT_FAST,
    },
    'flex-blue-detail': {
        start: 1.75,
        end: 2.4,
        reverseStart: 5.95,
        reverseEnd: 6.25,
        origin: '100% 50%',
        fromTranslate: '-4% 0%',
        fromScale: 0.96,
        ease: EASE_OUT_FAST,
    },
    'flex-red-detail': {
        start: 3.1,
        end: 3.35,
        reverseStart: 5.2,
        reverseEnd: 5.42,
        origin: '50% 50%',
        fromTranslate: '0% 4%',
        fromScale: 0.9,
        ease: EASE_OUT_FAST,
    },
    'flex-red-light': {
        start: 3.25,
        end: 3.55,
        reverseStart: 5.28,
        reverseEnd: 5.52,
        origin: '50% 50%',
        fromTranslate: '-4% 1%',
        fromScale: 0.91,
        ease: EASE_OUT_FAST,
    },
    'flex-red-main': {
        start: 3.4,
        end: 3.8,
        reverseStart: 5.5,
        reverseEnd: 5.85,
        origin: '50% 50%',
        fromTranslate: '-2% 3%',
        fromScale: 0.8,
        ease: EASE_OUT,
        overshoot: 1.025,
    },
    'flex-red-mid': {
        start: 3.65,
        end: 4.0,
        reverseStart: 5.38,
        reverseEnd: 5.64,
        origin: '50% 50%',
        fromTranslate: '3% 1%',
        fromScale: 0.9,
        ease: EASE_OUT_FAST,
    },
};

function clampScale(value: number): number {
    if (!Number.isFinite(value)) {
return 1;
}

    return Math.min(3, Math.max(0.1, value));
}

function initialFrame(config: PieceConfig): { opacity: number; translate: string; scale: string } {
    return {
        opacity: 0,
        translate: config.fromTranslate,
        scale: String(config.fromScale),
    };
}

function finalFrame(): { opacity: number; translate: string; scale: string } {
    return { opacity: 1, translate: '0% 0%', scale: '1' };
}

function pieceKeyframes(config: PieceConfig, total: number, loop: boolean): KeyframeFrame[] {
    const start = config.start / total;
    const end = config.end / total;
    const first = initialFrame(config);
    const final = finalFrame();

    const frames: KeyframeFrame[] = [
        { ...first, offset: 0, easing: config.ease },
        { ...first, offset: start, easing: config.ease },
    ];

    if (config.overshoot) {
        const overshootOffset = Math.max(start, end - (end - start) * 0.28);
        frames.push({
            opacity: 1,
            translate: '0% 0%',
            scale: String(config.overshoot),
            offset: overshootOffset,
            easing: config.ease,
        });
    }

    frames.push({ ...final, offset: end });

    if (!loop) {
        frames.push({ ...final, offset: 1 });

        return frames;
    }

    const reverseStart = config.reverseStart / total;
    const reverseEnd = config.reverseEnd / total;
    frames.push(
        { ...final, offset: reverseStart, easing: REVERSE_EASE },
        { ...first, offset: reverseEnd },
        { ...first, offset: 1 },
    );

    return frames;
}

function rootKeyframes(total: number, loop: boolean): KeyframeFrame[] {
    const frames: KeyframeFrame[] = [
        { scale: '1', offset: 0 },
        { scale: '1', offset: 4.0 / total, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
        { scale: '1.008', offset: 4.1 / total, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
        { scale: '1', offset: 4.35 / total },
    ];

    if (loop) {
frames.push({ scale: '1', offset: 1 });
} else {
frames.push({ scale: '1', offset: 1 });
}

    return frames;
}

export interface AnimatedFlexLogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'onPointerEnter'> {
    className?: string;
    animateOnMount?: boolean;
    replayOnHover?: boolean;
    loop?: boolean;
    durationScale?: number;
    ariaLabel?: string;
    onPointerEnter?: (event: React.PointerEvent<SVGSVGElement>) => void;
}

/**
 * Exact-source FLEX logo animation.
 *
 * Geometry, fills and source transforms below are copied verbatim from flex-logo.svg.
 * Animation uses compositor-friendly opacity + individual translate/scale properties,
 * so the original SVG transform attributes are never rewritten.
 */
export const AnimatedFlexLogo = forwardRef<FlexLogoHandle, AnimatedFlexLogoProps>(function AnimatedFlexLogo(
    {
        className = '',
        style,
        animateOnMount = true,
        replayOnHover = true,
        loop = false,
        durationScale = 1,
        ariaLabel = 'Flex logo',
        onPointerEnter,
        ...svgProps
    },
    forwardedRef,
) {
    const reactId = useId();
    const svgRef = useRef<SVGSVGElement>(null);
    const pieceRefs = useRef(new Map<string, SVGElement>());
    const animationsRef = useRef<Animation[]>([]);
    const runIdRef = useRef(0);
    const reducedMotionRef = useRef(false);

    const safeDurationScale = clampScale(durationScale);

    const registerPiece = useMemo(() => {
        const callbacks = new Map<string, (node: SVGElement | null) => void>();

        return (name: string) => {
            if (!callbacks.has(name)) {
                callbacks.set(name, (node) => {
                    if (node) {
pieceRefs.current.set(name, node);
} else {
pieceRefs.current.delete(name);
}
                });
            }

            return callbacks.get(name)!;
        };
    }, []);

    const cancel = useCallback(() => {
        runIdRef.current += 1;
        animationsRef.current.forEach((animation) => animation.cancel());
        animationsRef.current = [];
    }, []);

    const showStaticSource = useCallback(() => {
        cancel();
        // Cancelling WAAPI animations restores the untouched SVG source state.
    }, [cancel]);

    const play = useCallback(
        (options: { loop?: boolean } = {}) => {
            if (!svgRef.current) {
return;
}

            const shouldLoop = options.loop ?? loop;

            if (reducedMotionRef.current) {
                showStaticSource();

                return;
            }

            cancel();
            const runId = runIdRef.current;
            const total = shouldLoop ? LOOP_END : INTRO_END;
            const duration = total * 1000 * safeDurationScale;
            const animations: Animation[] = [];

            Object.entries(PIECES).forEach(([name, config]) => {
                const element = pieceRefs.current.get(name);

                if (!element) {
return;
}

                element.style.transformOrigin = config.origin;
                const animation = element.animate(pieceKeyframes(config, total, shouldLoop), {
                    duration,
                    iterations: shouldLoop ? Infinity : 1,
                    fill: 'both',
                });
                animations.push(animation);
            });

            const rootAnimation = svgRef.current!.animate(rootKeyframes(total, shouldLoop), {
                duration,
                iterations: shouldLoop ? Infinity : 1,
                fill: 'both',
            });
            animations.push(rootAnimation);
            animationsRef.current = animations;

            if (!shouldLoop) {
                void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
                    if (runId !== runIdRef.current) {
return;
}

                    // Drop all animation styles so the completed frame is literally the source SVG.
                    animations.forEach((animation) => animation.cancel());
                    animationsRef.current = [];
                });
            }
        },
        [cancel, loop, safeDurationScale, showStaticSource],
    );

    const pause = useCallback(() => {
        animationsRef.current.forEach((animation) => animation.pause());
    }, []);

    const resume = useCallback(() => {
        animationsRef.current.forEach((animation) => animation.play());
    }, []);

    const restart = useCallback(() => play(), [play]);

    useImperativeHandle(
        forwardedRef,
        () => ({ play, pause, resume, restart, stop: showStaticSource }),
        [pause, play, restart, resume, showStaticSource],
    );

    useIsomorphicLayoutEffect(() => {
        if (typeof window === 'undefined') {
return undefined;
}

        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const syncReducedMotion = () => {
            reducedMotionRef.current = media.matches;

            if (media.matches) {
showStaticSource();
} else if (animateOnMount) {
play();
}
        };

        reducedMotionRef.current = media.matches;

        if (media.matches || !animateOnMount) {
showStaticSource();
} else {
play();
}

        media.addEventListener?.('change', syncReducedMotion);

        return () => {
            media.removeEventListener?.('change', syncReducedMotion);
            cancel();
        };
    }, [animateOnMount, cancel, play, showStaticSource]);

    const handlePointerEnter = useCallback(
        (event: React.PointerEvent<SVGSVGElement>) => {
            onPointerEnter?.(event);

            if (replayOnHover && !loop && !reducedMotionRef.current && animationsRef.current.length === 0) {
                restart();
            }
        },
        [loop, onPointerEnter, replayOnHover, restart],
    );

    return (
        <svg
            ref={svgRef}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="5 65 246 125"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={ariaLabel}
            className={`flex-logo ${className}`.trim()}
            style={style}
            onPointerEnter={handlePointerEnter}
            {...svgProps}
        >
            <path
                ref={registerPiece('flex-f-main')}
                id={`${reactId}-flex-f-main`}
                className="flex-logo__piece"
                d="M0 0 C0.88076706 0.00141495 1.76153412 0.0028299 2.66899109 0.00428772 C5.47076878 0.00986688 8.27246537 0.02241554 11.07421875 0.03515625 C12.97851447 0.04017394 14.88281144 0.04473638 16.78710938 0.04882812 C21.44534356 0.05982948 26.10351742 0.07707976 30.76171875 0.09765625 C30.62383231 1.54632748 30.47943772 2.99438031 30.33227539 4.44213867 C30.25255997 5.24858322 30.17284454 6.05502777 30.0907135 6.88591003 C29.43741849 11.27784261 26.89774134 14.11032439 23.76171875 17.09765625 C16.69045849 21.87628135 9.74506907 22.24527547 1.44921875 22.16015625 C0.61326172 22.15564453 -0.22269531 22.15113281 -1.08398438 22.14648438 C-3.13544774 22.13476173 -5.18687398 22.11682828 -7.23828125 22.09765625 C-7.23828125 26.71765625 -7.23828125 31.33765625 -7.23828125 36.09765625 C3.32171875 36.09765625 13.88171875 36.09765625 24.76171875 36.09765625 C23.63845116 43.96052937 21.95807014 48.13518423 16.19921875 53.47265625 C8.48979733 57.11711001 1.03697225 57.33983793 -7.23828125 56.09765625 C-7.21733398 56.7117334 -7.19638672 57.32581055 -7.17480469 57.95849609 C-7.09060091 60.79637642 -7.03929702 63.63399277 -6.98828125 66.47265625 C-6.95476563 67.43816406 -6.92125 68.40367187 -6.88671875 69.3984375 C-6.78025567 77.32993664 -8.1594845 84.11979911 -13.09765625 90.5 C-18.28481176 94.71188453 -23.30341718 98.09765625 -30.23828125 98.09765625 C-30.33113933 87.67481047 -30.40212639 77.25206381 -30.44552994 66.82888794 C-30.4663661 61.98847802 -30.49461091 57.14835202 -30.54003906 52.30810547 C-30.58363883 47.63318101 -30.60744821 42.95852891 -30.61779022 38.28341675 C-30.62515629 36.50368973 -30.63954047 34.72397689 -30.66120148 32.94436646 C-30.69042403 30.44305719 -30.6942295 27.94285993 -30.69238281 25.44140625 C-30.70676392 24.71275864 -30.72114502 23.98411102 -30.73596191 23.23338318 C-30.6886953 17.28025659 -28.94885495 12.04702819 -24.86163712 7.59973145 C-17.16191735 0.84441994 -9.7494444 -0.05925923 0 0 Z "
                fill="#1F88CA"
                transform="translate(44.23828125,78.90234375)"
            />
            <path
                ref={registerPiece('flex-e-main')}
                id={`${reactId}-flex-e-main`}
                className="flex-logo__piece"
                d="M0 0 C8.49412715 7.33867603 13.43396664 16.23056382 14.33203125 27.46484375 C14.39424269 30.95434004 14.23712335 33.53862995 13.125 36.875 C-4.695 36.875 -22.515 36.875 -40.875 36.875 C-37.02593298 43.61086729 -35.03545732 46.48818089 -27.875 48.875 C-20.16692741 49.78932092 -14.96939601 49.19758917 -8.71484375 44.48046875 C-7.03689579 43.01627212 -5.44970332 41.44970332 -3.875 39.875 C0.085 42.185 4.045 44.495 8.125 46.875 C6.45817966 53.54228135 2.85389089 56.6261743 -2.8125 60.125 C-12.3492359 65.74729121 -23.10776569 66.39179936 -33.85546875 64.29296875 C-42.84584153 61.16277537 -50.14540342 53.98119423 -54.9375 45.89453125 C-58.93562012 37.28191416 -59.27000825 27.0653491 -57.1875 17.82421875 C-53.08341232 6.82868384 -45.73670553 -0.08299834 -35.1875 -4.9375 C-23.27131174 -9.20934107 -10.33277009 -7.4713876 0 0 Z M-36.375 13.375 C-38.97305807 15.80962795 -38.97305807 15.80962795 -40.875 18.875 C-40.875 19.865 -40.875 20.855 -40.875 21.875 C-28.335 21.875 -15.795 21.875 -2.875 21.875 C-4.78555665 16.93629926 -4.78555665 16.93629926 -8.25 13.6875 C-8.83523437 13.19894531 -9.42046875 12.71039063 -10.0234375 12.20703125 C-18.31809029 6.23978104 -28.46649274 6.99405282 -36.375 13.375 Z "
                fill="#01B0F1"
                transform="translate(162.875,112.125)"
            />
            <path
                ref={registerPiece('flex-x-main')}
                id={`${reactId}-flex-x-main`}
                className="flex-logo__piece"
                d="M0 0 C21.64843058 -1.74308872 21.64843058 -1.74308872 26.92089844 0.99902344 C29.98434728 3.75803016 31.48916504 7.24319227 33 11 C34.43752189 13.7960299 34.43752189 13.7960299 36 16 C36.66 16 37.32 16 38 16 C38.72703125 14.2675 38.72703125 14.2675 39.46875 12.5 C41.57124645 7.6184666 43.59094202 3.17499562 48 0 C56.40956169 -2.11259951 65.47386984 -0.97163876 74 0 C72.74516903 2.61019102 71.39466242 5.01573282 69.75 7.3984375 C69.09100708 8.35496216 69.09100708 8.35496216 68.41870117 9.33081055 C67.95052979 10.00539307 67.4823584 10.67997559 67 11.375 C66.51958252 12.0760083 66.03916504 12.7770166 65.54418945 13.49926758 C63.0955165 17.05518745 60.60213908 20.5575698 57.98046875 23.98828125 C57.51060547 24.61234863 57.04074219 25.23641602 56.55664062 25.87939453 C55.66057118 27.06275586 54.74952952 28.2349631 53.82226562 29.39404297 C52.4252804 31.1663494 52.4252804 31.1663494 51 34 C52.12549736 37.90689887 54.1850541 40.94305968 56.51953125 44.23828125 C57.21240234 45.22376953 57.90527344 46.20925781 58.61914062 47.22460938 C59.34294922 48.24361328 60.06675781 49.26261719 60.8125 50.3125 C65.38449488 56.77949367 69.88387731 63.23144461 74 70 C51.66682185 72.38602331 51.66682185 72.38602331 45.78710938 68.56005859 C42.04493917 64.62573992 38 58.5797712 38 53 C37.34 53 36.68 53 36 53 C34.92101223 55.69247412 33.8813842 58.35809392 32.96875 61.11328125 C31.207867 64.94882162 29.73554337 67.93460483 26 70 C17.48816791 71.59170122 8.57730375 70.7228065 0 70 C5.07758189 61.75918114 10.55705589 53.85833039 16.19970703 45.99511719 C16.78993652 45.16399414 17.38016602 44.33287109 17.98828125 43.4765625 C18.51977783 42.73486816 19.05127441 41.99317383 19.59887695 41.22900391 C21.10061697 38.83993153 22.21713052 36.71593802 23 34 C21.54577155 31.44342279 20.15079627 29.44150933 18.3125 27.1875 C17.28803867 25.86507984 16.2659818 24.54079416 15.24609375 23.21484375 C14.71226074 22.52890137 14.17842773 21.84295898 13.62841797 21.13623047 C10.92495078 17.58970304 8.3976456 13.92631249 5.875 10.25 C5.40231689 9.57090576 4.92963379 8.89181152 4.44262695 8.19213867 C2.57895673 5.48331167 1.04534484 3.13603451 0 0 Z "
                fill="#01B0F1"
                transform="translate(168,106)"
            />
            <path
                ref={registerPiece('flex-l-main')}
                id={`${reactId}-flex-l-main`}
                className="flex-logo__piece"
                d="M0 0 C3.6578218 2.03993908 5.66946174 3.50419262 8 7 C8.21240544 9.50485947 8.31121316 11.90241846 8.31884766 14.40893555 C8.32889328 15.16039856 8.3389389 15.91186157 8.34928894 16.68609619 C8.38017657 19.16962927 8.39717139 21.65305428 8.4140625 24.13671875 C8.43276968 25.85879958 8.45234275 27.5808712 8.4727478 29.30293274 C8.52412263 33.83532284 8.56371966 38.36774268 8.60089111 42.90026855 C8.64089726 47.5253844 8.69200504 52.15037598 8.7421875 56.77539062 C8.83901011 65.85017319 8.92339459 74.92502583 9 84 C11.64 84.99 14.28 85.98 17 87 C17 87.99 17 88.98 17 90 C-0.19446845 98.97839239 -0.19446845 98.97839239 -9 98 C-11.875 96.5 -11.875 96.5 -14 94 C-14.90849766 88.66501381 -15.15240435 83.42003699 -15.16113281 78.01098633 C-15.16609772 77.25707108 -15.17106262 76.50315582 -15.17617798 75.72639465 C-15.1906454 73.26159724 -15.19757192 70.79686393 -15.203125 68.33203125 C-15.20595238 67.48506872 -15.20877975 66.63810619 -15.21169281 65.76547813 C-15.2266148 61.29229807 -15.23589112 56.81914973 -15.24023438 52.34594727 C-15.2457403 47.73249386 -15.26983253 43.11933242 -15.29820633 38.50597095 C-15.31682938 34.94833009 -15.3220379 31.39076006 -15.32357025 27.83307457 C-15.32659291 26.13183669 -15.33460839 24.43059994 -15.34775543 22.72941017 C-15.36482574 20.35298857 -15.36293474 17.97728824 -15.35644531 15.60083008 C-15.3656601 14.90201721 -15.37487488 14.20320435 -15.3843689 13.48321533 C-15.34734505 9.1512579 -14.65935673 6.43894945 -12 3 C-7.94184834 0.38474671 -4.80855413 -0.70124748 0 0 Z "
                fill="#01B0F1"
                transform="translate(92,78)"
            />
            <path
                ref={registerPiece('flex-f-secondary')}
                id={`${reactId}-flex-f-secondary`}
                className="flex-logo__piece"
                d="M0 0 C-2.00776361 6.98154165 -3.90570884 12.39404766 -10.4375 16.25 C-16.94831203 19.27856981 -25.0983621 19.89618696 -32 18 C-31.97905273 18.61407715 -31.95810547 19.2281543 -31.93652344 19.86083984 C-31.85231966 22.69872017 -31.80101577 25.53633652 -31.75 28.375 C-31.71648438 29.34050781 -31.68296875 30.30601562 -31.6484375 31.30078125 C-31.54197442 39.23228039 -32.92120325 46.02214286 -37.859375 52.40234375 C-43.04653051 56.61422828 -48.06513593 60 -55 60 C-55 41.85 -55 23.7 -55 5 C-47.94625 4.87625 -47.94625 4.87625 -40.75 4.75 C-29.42088393 4.46714428 -18.71265802 3.49083442 -7.67578125 0.83984375 C-4 0 -4 0 0 0 Z "
                fill="#00B0F1"
                transform="translate(69,117)"
            />
            <path
                ref={registerPiece('flex-l-detail')}
                id={`${reactId}-flex-l-detail`}
                className="flex-logo__piece"
                d="M0 0 C3.6578218 2.03993908 5.66946174 3.50419262 8 7 C8.7286138 11.44793306 8.45265778 15.05696295 6.5 19.125 C0.95316915 25.50385548 -5.25194917 30.51176965 -13 34 C-13.66 34 -14.32 34 -15 34 C-15.08725659 29.7709638 -15.1404789 25.54215988 -15.1875 21.3125 C-15.21263672 20.11431641 -15.23777344 18.91613281 -15.26367188 17.68164062 C-15.27333984 16.52470703 -15.28300781 15.36777344 -15.29296875 14.17578125 C-15.3086792 13.11270752 -15.32438965 12.04963379 -15.34057617 10.9543457 C-14.94855385 7.55372769 -14.03258972 5.73137664 -12 3 C-7.94184834 0.38474671 -4.80855413 -0.70124748 0 0 Z "
                fill="#1E87C9"
                transform="translate(92,78)"
            />
            <path
                ref={registerPiece('flex-red-main')}
                id={`${reactId}-flex-red-main`}
                className="flex-logo__piece"
                d="M0 0 C4.95 1.98 4.95 1.98 10 4 C8.53325361 5.73342755 7.06266097 7.46385337 5.56640625 9.171875 C3.90065135 11.06596561 3.90065135 11.06596561 2.1875 13.5 C-0.99026335 15.67903773 -3.47974396 14.95488001 -7.171875 14.359375 C-7.77515625 14.24078125 -8.3784375 14.1221875 -9 14 C-7.03208346 8.40435852 -3.70038482 4.5912182 0 0 Z "
                fill="#C21619"
                transform="translate(150,89)"
            />
            <path
                ref={registerPiece('flex-red-mid')}
                id={`${reactId}-flex-red-mid`}
                className="flex-logo__piece"
                d="M0 0 C1.65 0 3.3 0 5 0 C4.0919838 1.13199353 3.17316174 2.25532363 2.25 3.375 C1.73953125 4.00148438 1.2290625 4.62796875 0.703125 5.2734375 C-1.13213074 7.13394906 -2.55299453 8.09649029 -5 9 C-8.75 8.625 -8.75 8.625 -12 8 C-11.34 6.35 -10.68 4.7 -10 3 C-9.67 3.99 -9.34 4.98 -9 6 C-8.236875 5.67 -7.47375 5.34 -6.6875 5 C-4 4 -4 4 -1 4 C-0.67 2.68 -0.34 1.36 0 0 Z "
                fill="#D11F24"
                transform="translate(153,95)"
            />
            <path
                ref={registerPiece('flex-red-light')}
                id={`${reactId}-flex-red-light`}
                className="flex-logo__piece"
                d="M0 0 C4.95 1.98 4.95 1.98 10 4 C9.34 4.66 8.68 5.32 8 6 C5.99759451 5.68143549 3.99788438 5.34578768 2 5 C-1.26410357 5.37617294 -1.26410357 5.37617294 -4 6 C-1.125 1.125 -1.125 1.125 0 0 Z "
                fill="#B92729"
                transform="translate(150,89)"
            />
            <path
                ref={registerPiece('flex-red-detail')}
                id={`${reactId}-flex-red-detail`}
                className="flex-logo__piece"
                d="M0 0 C0.33 0.99 0.66 1.98 1 3 C3.97 3.495 3.97 3.495 7 4 C7 4.66 7 5.32 7 6 C4.03 5.67 1.06 5.34 -2 5 C-1.34 3.35 -0.68 1.7 0 0 Z "
                fill="#CB2D30"
                transform="translate(143,98)"
            />
            <path
                ref={registerPiece('flex-blue-detail')}
                id={`${reactId}-flex-blue-detail`}
                className="flex-logo__piece"
                d="M0 0 C-0.33 0.99 -0.66 1.98 -1 3 C-1.99 3 -2.98 3 -4 3 C-4.66 4.32 -5.32 5.64 -6 7 C-6.66 6.34 -7.32 5.68 -8 5 C-2.25 0 -2.25 0 0 0 Z "
                fill="#288BC7"
                transform="translate(26,83)"
            />
        </svg>
    );
});