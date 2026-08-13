import React, { forwardRef, useId } from 'react';

export interface FlexBrandSvgProps extends React.SVGProps<SVGSVGElement> {
    /** Whether this instance renders next to visible FLEX text. */
    standalone?: boolean;
}

/**
 * Official FLEX F-monogram — the static, authoritative brand mark.
 *
 * Geometry, viewBox, gradient, colors and red accent are preserved exactly from
 * the supplied official SVG. A unique gradient id is generated per instance so
 * multiple marks on the same page never collide.
 */
export const FlexBrandSvg = forwardRef<SVGSVGElement, FlexBrandSvgProps>(function FlexBrandSvg(
    { standalone = true, ...props },
    ref
) {
    const gradientId = useId();

    const a11y = standalone
        ? { role: 'img' as const, 'aria-label': 'FLEX' }
        : { 'aria-hidden': true as const };

    return (
        <svg ref={ref} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...a11y} {...props}>
            <defs>
                <linearGradient id={gradientId} x1="15" y1="15" x2="70" y2="85" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#3FC5F2" />
                    <stop offset="1" stopColor="#1C7FDB" />
                </linearGradient>
            </defs>

            <g data-brand-part="foundation">
                <rect x="26" y="18" width="15" height="64" rx="7.5" fill={`url(#${gradientId})`} />
            </g>

            <g data-brand-part="top-arm">
                <rect x="26" y="18" width="46" height="15" rx="7.5" fill={`url(#${gradientId})`} />
            </g>

            <g data-brand-part="middle-arm">
                <rect x="26" y="43" width="36" height="15" rx="7.5" fill={`url(#${gradientId})`} />
            </g>

            <g data-brand-part="accent">
                <rect x="66" y="18" width="12" height="12" rx="3" fill="#E23A2E" />
            </g>
        </svg>
    );
});
