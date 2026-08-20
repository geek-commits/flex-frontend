/**
 * Semantic anchor model for the shell-level active-call Dynamic Island.
 *
 * The island persists a semantic anchor (never raw x/y), so a saved position
 * survives different monitors, window resize, sidebar collapse, mobile
 * rotation, and safe-area changes.
 */

export type CallIslandAnchor =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'middle-left'
    | 'middle-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

export const DEFAULT_CALL_ISLAND_ANCHOR: CallIslandAnchor = 'top-center';

export const CALL_ISLAND_ANCHORS: readonly CallIslandAnchor[] = [
    'top-left',
    'top-center',
    'top-right',
    'middle-left',
    'middle-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
];

/**
 * Narrow screens (mobile/tablet) prefer corner and top/bottom anchors. Middle
 * anchors are awkward on narrow widths and are excluded.
 */
const MOBILE_CALL_ISLAND_ANCHORS: ReadonlySet<CallIslandAnchor> = new Set([
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
]);

/** Minimum gap between the island and the viewport edge. */
export const CALL_ISLAND_VIEWPORT_MARGIN = 12;

/** Breakpoint at which the full desktop anchor set becomes available. */
export const CALL_ISLAND_MOBILE_BREAKPOINT = 768;

/** Anchors valid for the given viewport width. */
export function validCallIslandAnchors(width: number): CallIslandAnchor[] {
    return width < CALL_ISLAND_MOBILE_BREAKPOINT
        ? CALL_ISLAND_ANCHORS.filter((anchor) => MOBILE_CALL_ISLAND_ANCHORS.has(anchor))
        : [...CALL_ISLAND_ANCHORS];
}

export function isCallIslandAnchor(value: unknown): value is CallIslandAnchor {
    return typeof value === 'string' && (CALL_ISLAND_ANCHORS as readonly string[]).includes(value);
}

export interface CallIslandSafeAreaInsets {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export const EMPTY_SAFE_AREA: CallIslandSafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

export interface CallIslandRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

/**
 * Direction the expanded panel grows from the compact anchor. Expanded content
 * always grows inward so it never spills past the anchor edge toward the edge
 * of the screen.
 */
export type CallIslandExpandDirection = 'down' | 'up' | 'right' | 'left';

export function expandDirectionForAnchor(anchor: CallIslandAnchor): CallIslandExpandDirection {
    switch (anchor) {
        case 'top-left':
        case 'top-center':
        case 'top-right':
            return 'down';
        case 'bottom-left':
        case 'bottom-center':
        case 'bottom-right':
            return 'up';
        case 'middle-left':
            return 'right';
        case 'middle-right':
            return 'left';
    }
}