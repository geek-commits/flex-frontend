import { animate, useMotionValue, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    DEFAULT_CALL_ISLAND_ANCHOR,
    
    
    
    validCallIslandAnchors
} from './anchor';
import type {CallIslandAnchor, CallIslandRect, CallIslandSafeAreaInsets} from './anchor';
import {
    resolveCallIslandPosition
    
    
} from './resolve-anchor';
import type {CallIslandSize, CallIslandViewport} from './resolve-anchor';
import { getCallIslandAnchor, setCallIslandAnchor } from './use-call-island-anchor';

/** Snap travel duration (ms). Restrained — no bounce or overshoot. */
const SNAP_DURATION_MS = 200;

export interface CallIslandDragOptions {
    /** Whether the island is currently allowed to be dragged (compact only). */
    enabled: boolean;
    viewport: CallIslandViewport;
    islandSize: CallIslandSize;
    safeArea: CallIslandSafeAreaInsets;
    /** Critical shell regions the island must not cover. */
    safeZones: CallIslandRect[];
}

export interface CallIslandDragController {
    x: ReturnType<typeof useMotionValue<number>>;
    y: ReturnType<typeof useMotionValue<number>>;
    /** Current preferred anchor. */
    anchor: CallIslandAnchor;
    /** Whether a real drag is in progress (past the click threshold). */
    isDragging: boolean;
    /** Props to spread onto the motion drag surface. */
    dragProps: Record<string, unknown>;
    /** True while a drag gesture is active, so a trailing click is not a toggle. */
    didDrag: () => boolean;
}

const intersects = (a: CallIslandRect, b: CallIslandRect): boolean =>
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

function rectForPosition(
    position: { x: number; y: number },
    size: CallIslandSize,
): CallIslandRect {
    return {
        left: position.x,
        top: position.y,
        right: position.x + size.width,
        bottom: position.y + size.height,
    };
}

function collidesWithSafeZones(
    position: { x: number; y: number },
    size: CallIslandSize,
    safeZones: CallIslandRect[],
): boolean {
    const pill = rectForPosition(position, size);

    return safeZones.some((zone) => intersects(pill, zone));
}

function nearestAnchorFromPoint(
    px: number,
    py: number,
    opts: Omit<CallIslandDragOptions, 'enabled'>,
): CallIslandAnchor {
    const { viewport, islandSize, safeArea, safeZones } = opts;
    const valid = validCallIslandAnchors(viewport.width);

    let best: CallIslandAnchor | null = null;
    let bestDistance = Infinity;

    for (const candidate of valid) {
        const position = resolveCallIslandPosition({
            anchor: candidate,
            viewport,
            islandSize,
            safeArea,
        });

        if (collidesWithSafeZones(position, islandSize, safeZones)) {
            continue;
        }

        const centerX = position.x + islandSize.width / 2;
        const centerY = position.y + islandSize.height / 2;
        const distance = (centerX - px) ** 2 + (centerY - py) ** 2;

        if (distance < bestDistance) {
            bestDistance = distance;
            best = candidate;
        }
    }

    return best ?? DEFAULT_CALL_ISLAND_ANCHOR;
}

function positionForAnchor(
    anchor: CallIslandAnchor,
    opts: Omit<CallIslandDragOptions, 'enabled'>,
): { x: number; y: number } {
    return resolveCallIslandPosition({
        anchor,
        viewport: opts.viewport,
        islandSize: opts.islandSize,
        safeArea: opts.safeArea,
    });
}

export function useCallIslandDrag(options: CallIslandDragOptions): CallIslandDragController {
    const { enabled, viewport, islandSize, safeArea, safeZones } = options;
    const shouldReduceMotion = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [anchor, setAnchor] = useState<CallIslandAnchor>(() => getCallIslandAnchor());

const initializedRef = useRef(false);
    const prevSizeRef = useRef({ width: islandSize.width, height: islandSize.height });
    const didDragRef = useRef(false);

    const anchorRef = useRef(anchor);

    useEffect(() => {
        anchorRef.current = anchor;
    }, [anchor]);

    /** Move x/y to the given anchor's resolved position. */
    const applyAnchor = useCallback(
        (target: CallIslandAnchor, animateMotion: boolean) => {
            const position = positionForAnchor(target, {
                viewport,
                islandSize,
                safeArea,
                safeZones,
            });

            if (!animateMotion || shouldReduceMotion) {
                x.set(position.x);
                y.set(position.y);

                return;
            }

            animate(x, position.x, { duration: SNAP_DURATION_MS / 1000, ease: 'easeOut' });
            animate(y, position.y, { duration: SNAP_DURATION_MS / 1000, ease: 'easeOut' });
        },
        [viewport, islandSize, safeArea, safeZones, shouldReduceMotion, x, y],
    );

    // Mount, viewport, and island-size changes re-resolve the current anchor.
    // Saved anchor is never overwritten — only its pixel position is recomputed.
    useEffect(() => {
        const sizeChanged =
            prevSizeRef.current.width !== islandSize.width ||
            prevSizeRef.current.height !== islandSize.height;
        prevSizeRef.current = { width: islandSize.width, height: islandSize.height };

        if (!initializedRef.current) {
            initializedRef.current = true;
            applyAnchor(anchorRef.current, false);
        } else {
            applyAnchor(anchorRef.current, sizeChanged);
        }
    }, [viewport.width, viewport.height, islandSize.width, islandSize.height, safeArea, applyAnchor]);

    const clampDrag = useCallback(
        (currentX: number, currentY: number): { x: number; y: number } => {
            const m = 12 + safeArea.top;
            const right = 12 + safeArea.right;
            const bottom = 12 + safeArea.bottom;
            const left = 12 + safeArea.left;

            const minX = left;
            const maxX = Math.max(left, viewport.width - islandSize.width - right);
            const minY = m;
            const maxY = Math.max(m, viewport.height - islandSize.height - bottom);

            return {
                x: Math.min(Math.max(currentX, minX), maxX),
                y: Math.min(Math.max(currentY, minY), maxY),
            };
        },
        [viewport, islandSize, safeArea],
    );

    const handleDragStart = useCallback(() => {
        didDragRef.current = true;
        setIsDragging(true);
    }, []);

    const handleDrag = useCallback(() => {
        const clamped = clampDrag(x.get(), y.get());

        if (clamped.x !== x.get()) {
x.set(clamped.x);
}

        if (clamped.y !== y.get()) {
y.set(clamped.y);
}
    }, [clampDrag, x, y]);

    const handleDragEnd = useCallback(() => {
        didDragRef.current = false;
        setIsDragging(false);

        const pill = rectForPosition({ x: x.get(), y: y.get() }, islandSize);
        const centerX = pill.left + islandSize.width / 2;
        const centerY = pill.top + islandSize.height / 2;

        const nearest = nearestAnchorFromPoint(centerX, centerY, {
            viewport,
            islandSize,
            safeArea,
            safeZones,
        });

        setAnchor(nearest);
        setCallIslandAnchor(nearest);
        applyAnchor(nearest, true);
    }, [viewport, islandSize, safeArea, safeZones, applyAnchor, x, y]);

const dragProps = useMemo(
        () => ({
            drag: enabled,
            dragMomentum: false,
            dragElastic: 0,
            onDragStart: handleDragStart,
            onDrag: handleDrag,
            onDragEnd: handleDragEnd,
        }),
        [enabled, handleDragStart, handleDrag, handleDragEnd],
    );

    const didDrag = useCallback(() => didDragRef.current, []);

    return { x, y, anchor, isDragging, dragProps, didDrag };
}