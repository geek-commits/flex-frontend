import { RiPhoneFill } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export interface DialerProps {
    dialNumber: string;
    onDialNumberChange: (value: string) => void;
    onDial: () => void;
}

/**
 * Dial input + compact dialpad (AGENT_WORKSPACE_PLAN §26, §27).
 * The Call action is disabled until the target is usable; duplicate
 * initiation is impossible because dialing only starts from idle.
 */
export function Dialer({ dialNumber, onDialNumberChange, onDial }: DialerProps) {
    const canDial = dialNumber.trim().length > 0;

    return (
        <div className="flex flex-col gap-3">
            <div className="relative">
                <Input
                    placeholder="Enter phone number..."
                    value={dialNumber}
                    onChange={(e) => onDialNumberChange(e.target.value)}
                    inputMode="tel"
                    autoComplete="off"
                    className="h-10 text-base font-mono text-center font-bold tracking-wider"
                    aria-label="Phone number to call"
                />
            </div>

            <div className="grid grid-cols-3 gap-2 px-2" role="group" aria-label="Dialpad">
                {KEYPAD.map((digit) => (
                    <button
                        key={digit}
                        type="button"
                        onClick={() => onDialNumberChange(dialNumber + digit)}
                        className="h-11 rounded-lg bg-muted/50 hover:bg-muted font-mono text-base font-bold text-foreground flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                        aria-label={`Dial ${digit}`}
                    >
                        {digit}
                    </button>
                ))}
            </div>

            <Button
                disabled={!canDial}
                onClick={onDial}
                className="h-10 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 mt-1"
            >
                <RiPhoneFill className="size-4" />
                <span>Call</span>
            </Button>
        </div>
    );
}
