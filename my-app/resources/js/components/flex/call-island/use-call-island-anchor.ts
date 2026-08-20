import { useSyncExternalStore } from 'react';
import {
    DEFAULT_CALL_ISLAND_ANCHOR,
    isCallIslandAnchor
    
} from './anchor';
import type {CallIslandAnchor} from './anchor';

/**
 * Semantic-anchor preference for the active-call island.
 *
 * Persists ONLY the semantic anchor (never raw x/y, never call identity) in
 * localStorage, following the same pattern as the `appearance` preference.
 * The island survives route changes and future calls without remounting this
 * preference.
 */

export const CALL_ISLAND_ANCHOR_STORAGE_KEY = 'flex.callIsland.anchor';

const listeners = new Set<() => void>();

function readStoredAnchor(): CallIslandAnchor {
    if (typeof window === 'undefined') {
        return DEFAULT_CALL_ISLAND_ANCHOR;
    }

    try {
        const raw = window.localStorage.getItem(CALL_ISLAND_ANCHOR_STORAGE_KEY);

        return isCallIslandAnchor(raw) ? raw : DEFAULT_CALL_ISLAND_ANCHOR;
    } catch {
        return DEFAULT_CALL_ISLAND_ANCHOR;
    }
}

let currentAnchor: CallIslandAnchor = readStoredAnchor();

function emit(): void {
    listeners.forEach((listener) => listener());
}

/** Read the saved anchor (for use outside React). */
export function getCallIslandAnchor(): CallIslandAnchor {
    return currentAnchor;
}

/** Persist a new preferred anchor. Call once on drop, never per drag frame. */
export function setCallIslandAnchor(anchor: CallIslandAnchor): void {
    if (anchor === currentAnchor) {
        return;
    }

    currentAnchor = anchor;

    try {
        window.localStorage.setItem(CALL_ISLAND_ANCHOR_STORAGE_KEY, anchor);
    } catch {
        // Storage unavailable (e.g. private mode); keep in-memory preference.
    }

    emit();
}

/** Reactive binding for the current preferred anchor. */
export function useCallIslandAnchor(): CallIslandAnchor {
    return useSyncExternalStore(
        (onChange) => {
            listeners.add(onChange);

            return () => listeners.delete(onChange);
        },
        () => currentAnchor,
        () => DEFAULT_CALL_ISLAND_ANCHOR,
    );
}