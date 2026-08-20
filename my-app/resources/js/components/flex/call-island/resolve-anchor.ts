import {
    
    
    CALL_ISLAND_VIEWPORT_MARGIN
} from './anchor';
import type {CallIslandAnchor, CallIslandSafeAreaInsets} from './anchor';

/**
 * One resolver computes a semantic anchor's pixel position. No offsets are
 * scattered across JSX — the island asks for its position and trusts it stays
 * inside the visible viewport.
 */

export interface CallIslandViewport {
    width: number;
    height: number;
}

export interface CallIslandSize {
    width: number;
    height: number;
}

export interface CallIslandPosition {
    /** Left edge of the island, in viewport px. */
    x: number;
    /** Top edge of the island, in viewport px. */
    y: number;
}

type HorizontalEdge = 'left' | 'center' | 'right';
type VerticalEdge = 'top' | 'middle' | 'bottom';

function horizontalEdge(anchor: CallIslandAnchor): HorizontalEdge {
    switch (anchor) {
        case 'top-left':
        case 'middle-left':
        case 'bottom-left':
            return 'left';
        case 'top-center':
        case 'bottom-center':
            return 'center';
        case 'top-right':
        case 'middle-right':
        case 'bottom-right':
            return 'right';
    }
}

function verticalEdge(anchor: CallIslandAnchor): VerticalEdge {
    switch (anchor) {
        case 'top-left':
        case 'top-center':
        case 'top-right':
            return 'top';
        case 'middle-left':
        case 'middle-right':
            return 'middle';
        case 'bottom-left':
        case 'bottom-center':
        case 'bottom-right':
            return 'bottom';
    }
}

export function resolveCallIslandPosition(params: {
    anchor: CallIslandAnchor;
    viewport: CallIslandViewport;
    islandSize: CallIslandSize;
    safeArea: CallIslandSafeAreaInsets;
}): CallIslandPosition {
    const { anchor, viewport, islandSize, safeArea } = params;

    const margin = CALL_ISLAND_VIEWPORT_MARGIN;
    const topInset = margin + safeArea.top;
    const rightInset = margin + safeArea.right;
    const bottomInset = margin + safeArea.bottom;
    const leftInset = margin + safeArea.left;

    const horizontal = horizontalEdge(anchor);
    const vertical = verticalEdge(anchor);

    const x =
        horizontal === 'left'
            ? leftInset
            : horizontal === 'right'
              ? Math.max(leftInset, viewport.width - islandSize.width - rightInset)
              : Math.max(leftInset, (viewport.width - islandSize.width) / 2);

    const y =
        vertical === 'top'
            ? topInset
            : vertical === 'bottom'
              ? Math.max(topInset, viewport.height - islandSize.height - bottomInset)
              : Math.max(topInset, (viewport.height - islandSize.height) / 2);

    return { x, y };
}