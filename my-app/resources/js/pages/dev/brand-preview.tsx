import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import type { FlexLogoHandle } from '@/components/flex/brand/animated-flex-logo';
import { AnimatedFlexLogo } from '@/components/flex/brand/animated-flex-logo';
import { FlexBrandMark } from '@/components/flex/brand/flex-brand-mark';

const VARIANT_CONFIG = [
    { label: 'sidebar', width: 132, durationScale: 0.28 },
    { label: 'auth', width: 240, durationScale: 0.38 },
    { label: 'static', width: 160, durationScale: 0.28 },
] as const;

function Controls({
    handle,
    loop,
    onToggleLoop,
}: {
    handle: FlexLogoHandle;
    loop: boolean;
    onToggleLoop: () => void;
}) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <button
                type="button"
                className="rounded-md border px-3 py-1 text-sm"
                onClick={() => handle.play()}
            >
                Play
            </button>
            <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => handle.pause()}>
                Pause
            </button>
            <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => handle.resume()}>
                Resume
            </button>
            <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => handle.restart()}>
                Restart
            </button>
            <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => handle.stop()}>
                Stop
            </button>
            <button
                type="button"
                className={`rounded-md border px-3 py-1 text-sm ${loop ? 'bg-foreground text-background' : ''}`}
                onClick={onToggleLoop}
            >
                Loop: {loop ? 'on' : 'off'}
            </button>
        </div>
    );
}

function WordmarkRow({
    label,
    width,
    durationScale,
    loop,
    onToggleLoop,
}: {
    label: string;
    width: number;
    durationScale: number;
    loop: boolean;
    onToggleLoop: () => void;
}) {
    const [handle, setHandle] = useState<FlexLogoHandle | null>(null);

    return (
        <div className="flex flex-col gap-3 border p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
            <AnimatedFlexLogo
                ref={(node) => {
                    if (node) {
                        setHandle(node);
                    }
                }}
                className="bg-muted/30"
                style={{ width }}
                loop={loop}
                durationScale={durationScale}
                ariaLabel={`${label} FLEX preview`}
            />
            {handle ? <Controls handle={handle} loop={loop} onToggleLoop={onToggleLoop} /> : null}
        </div>
    );
}

export default function BrandPreview() {
    const [loop, setLoop] = useState(false);

    return (
        <>
            <Head title="Brand preview (dev)" />

            <div className="flex min-h-svh flex-col gap-8 p-8">
                <header className="flex flex-col gap-1">
                    <h1 className="text-xl font-medium">FLEX brand preview (dev only)</h1>
                    <p className="text-sm text-muted-foreground">
                        Canonical wordmark animation surfaces. Not part of production navigation.
                    </p>
                </header>

                <section className="grid max-w-3xl gap-4">
                    {VARIANT_CONFIG.map((config) => (
                        <WordmarkRow
                            key={config.label}
                            label={config.label}
                            width={config.width}
                            durationScale={config.durationScale}
                            loop={loop}
                            onToggleLoop={() => setLoop((current) => !current)}
                        />
                    ))}

                    <div className="flex flex-col gap-3 border p-4">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">collapsed</span>
                        <FlexBrandMark size={30} standalone className="bg-muted/30" />
                        <span className="text-xs text-muted-foreground">Compact monogram (no animation, 30px).</span>
                    </div>
                </section>
            </div>
        </>
    );
}