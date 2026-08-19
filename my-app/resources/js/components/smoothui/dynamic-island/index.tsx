"use client";

import { motion, useReducedMotion } from "motion/react";
import type {ReactNode} from "react";

/**
 * SmoothUI Dynamic Island — adapted for FLEX.
 *
 * Animated container primitive: a pill that springs between `compact` and
 * `expanded` shapes. All demo content (weather / music / notification / ring
 * examples and the showcase view-switcher) has been removed so this stays a
 * pure animated container. Content is injected by the FLEX wrapper.
 *
 * Respects `prefers-reduced-motion` via Motion's reduced-motion hook.
 */

export type DynamicIslandView = "compact" | "expanded";

export interface DynamicIslandProps {
    className?: string;
    compactContent?: ReactNode;
    expandedContent?: ReactNode;
    view: DynamicIslandView;
}

export function DynamicIsland({
    className = "",
    compactContent,
    expandedContent,
    view,
}: DynamicIslandProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={`w-fit min-w-[100px] overflow-hidden rounded-[32px] ${className}`}
            layout
            transition={
                shouldReduceMotion
                    ? { duration: 0 }
                    : { bounce: 0.3, duration: 0.22, type: "spring" }
            }
        >
            <motion.div
                animate={
                    shouldReduceMotion
                        ? { opacity: 1, scale: 1 }
                        : {
                              opacity: 1,
                              originX: 0.5,
                              originY: 0.5,
                              scale: 1,
                              transition: { delay: 0.05 },
                          }
                }
                initial={{ opacity: 0, originX: 0.5, originY: 0.5, scale: 0.92 }}
                key={view}
                transition={
                    shouldReduceMotion
                        ? { duration: 0 }
                        : { bounce: 0.3, type: "spring" }
                }
            >
                {view === "compact" ? compactContent : expandedContent}
            </motion.div>
        </motion.div>
    );
}