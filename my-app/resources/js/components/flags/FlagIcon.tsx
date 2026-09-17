import * as React from 'react';
import type { FlexLocale } from '@/i18n/locale';

type FlagCode = 'gb' | 'fr' | 'tz';

const LOCALE_TO_FLAG: Record<FlexLocale, FlagCode> = {
    en: 'gb',
    fr: 'fr',
    sw: 'tz',
};

export function hasFlag(code: FlexLocale): boolean {
    return code in LOCALE_TO_FLAG;
}

function FlagGB() {
    return (
        <svg
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
            className="size-full"
        >
            <path fill="#012169" d="M0 0h512v512H0z" />
            <path
                fill="#FFF"
                d="M512 0v64L322 256l190 187v69h-67L254 324 68 512H0v-68l186-187L0 74V0h62l192 188L440 0z"
            />
            <path
                fill="#C8102E"
                d="m184 324 11 34L42 512H0v-3zm124-12 54 8 150 147v45zM512 0 320 196l-4-44L466 0zM0 1l193 189-59-8L0 49z"
            />
            <path fill="#FFF" d="M176 0v512h160V0zM0 176v160h512V176z" />
            <path fill="#C8102E" d="M0 208v96h512v-96zM208 0v512h96V0z" />
        </svg>
    );
}

function FlagFR() {
    return (
        <svg
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
            className="size-full"
        >
            <path fill="#fff" d="M0 0h512v512H0z" />
            <path fill="#000091" d="M0 0h170.7v512H0z" />
            <path fill="#e1000f" d="M341.3 0H512v512H341.3z" />
        </svg>
    );
}

function FlagTZ({ clipId }: { clipId: string }) {
    return (
        <svg
            viewBox="0 0 512 512"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            focusable="false"
            className="size-full"
        >
            <defs>
                <clipPath id={clipId}>
                    <path fillOpacity=".7" d="M102.9 0h496v496H103z" />
                </clipPath>
            </defs>
            <g clipPath={`url(#${clipId})`} transform="translate(-106.2)scale(1.0321)">
                <g fillRule="evenodd" strokeWidth="1pt">
                    <path fill="#09f" d="M0 0h744.1v496H0z" />
                    <path fill="#090" d="M0 0h744.1L0 496z" />
                    <path fill="#000001" d="M0 496h165.4L744 103.4V0H578.7L0 392.7v103.4z" />
                    <path
                        fill="#ff0"
                        d="M0 378 567 0h56L0 415.3v-37.2zm121.1 118 623-415.3V118L177 496z"
                    />
                </g>
            </g>
        </svg>
    );
}

export interface FlagIconProps {
    code: FlexLocale;
    className?: string;
    'aria-label'?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
}

export function FlagIcon({ code, className, 'aria-label': ariaLabel, 'aria-hidden': ariaHidden }: FlagIconProps) {
    const flag = LOCALE_TO_FLAG[code];
    const uid = React.useId();
    const tzClipId = `flag-tz-clip-${uid.replace(/:/g, '')}`;

    if (!flag) {
        return null;
    }

    const isDecorative = ariaHidden !== false && !ariaLabel;
    const ariaProps = isDecorative
        ? ({ 'aria-hidden': true } as const)
        : ariaLabel
            ? ({ 'aria-label': ariaLabel, role: 'img' } as const)
            : ({ 'aria-hidden': true } as const);

    let inner: React.ReactNode;

    switch (flag) {
        case 'gb': {
            inner = <FlagGB />;
            break;
        }
        case 'fr': {
            inner = <FlagFR />;
            break;
        }
        case 'tz': {
            inner = <FlagTZ clipId={tzClipId} />;
            break;
        }
        default: {
            inner = null;
        }
    }

    if (className) {
        return (
            <span className={className} {...ariaProps}>
                {inner}
            </span>
        );
    }

    return (
        <span className="inline-flex size-full items-center justify-center" {...ariaProps}>
            {inner}
        </span>
    );
}
