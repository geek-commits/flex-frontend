import {
    RiPhoneLine,
    RiPhoneFill,
    RiMicLine,
    RiMicOffLine,
    RiPauseLine,
    RiPlayLine,
    RiArrowRightLine,
    RiSearchLine,
} from '@remixicon/react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CallState } from '@/types/flex';

export function CallManager() {
    const [callState, setCallState] = useState<CallState>('idle');
    const [dialNumber, setDialNumber] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isOnHold, setIsOnHold] = useState(false);
    const [activeTab, setActiveTab] = useState<'dialer' | 'history'>('dialer');

    const handleKeyPress = (num: string) => {
        setDialNumber((prev) => prev + num);
    };

    const handleCall = () => {
        if (!dialNumber) {
return;
}

        setCallState('dialing');
        setTimeout(() => setCallState('ringing'), 1000);
        setTimeout(() => setCallState('connected'), 2500);
    };

    const handleEndCall = () => {
        setCallState('wrap-up');
        setTimeout(() => {
            setCallState('idle');
            setDialNumber('');
            setIsMuted(false);
            setIsOnHold(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-full bg-card select-none text-xs">
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 font-bold text-foreground">
                    <RiPhoneLine className="size-4 text-primary" />
                    <span>Call Manager</span>
                </div>
                <Badge
                    variant="outline"
                    className={`capitalize font-semibold text-[10px] ${
                        callState === 'connected'
                            ? 'bg-status-live-bg text-status-live border-status-live/30'
                            : callState === 'dialing' || callState === 'ringing'
                            ? 'bg-status-stale-bg text-status-stale border-status-stale/30'
                            : 'bg-muted text-muted-foreground'
                    }`}
                >
                    {callState}
                </Badge>
            </div>

            {/* Active Call Control Card (when in call) */}
            {callState !== 'idle' && (
                <div className="p-3 bg-primary/5 border-b border-border flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-foreground">
                                {dialNumber || '+255 712 345 678'}
                            </span>
                            <span className="text-[10px] text-muted-foreground">Inbound Queue: Customer Support</span>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary">02:14</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                        <Button
                            variant={isMuted ? 'destructive' : 'outline'}
                            size="xs"
                            onClick={() => setIsMuted(!isMuted)}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <RiMicOffLine className="size-3.5" /> : <RiMicLine className="size-3.5" />}
                        </Button>

                        <Button
                            variant={isOnHold ? 'secondary' : 'outline'}
                            size="xs"
                            onClick={() => setIsOnHold(!isOnHold)}
                            title={isOnHold ? 'Resume' : 'Hold'}
                        >
                            {isOnHold ? <RiPlayLine className="size-3.5" /> : <RiPauseLine className="size-3.5" />}
                        </Button>

                        <Button variant="outline" size="xs" title="Transfer Call">
                            <RiArrowRightLine className="size-3.5" />
                        </Button>

                        <Button variant="destructive" size="xs" onClick={handleEndCall} title="End Call">
                            <RiPhoneLine className="size-3.5" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Sub-tabs: Dialer / History */}
            <div className="flex items-center border-b border-border bg-muted/20 px-2 shrink-0">
                <button
                    onClick={() => setActiveTab('dialer')}
                    className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-colors ${
                        activeTab === 'dialer'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Dialer
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition-colors ${
                        activeTab === 'history'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Call Log
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-3">
                {activeTab === 'dialer' ? (
                    <div className="flex flex-col gap-3">
                        {/* Number Display Input */}
                        <div className="relative">
                            <Input
                                placeholder="Enter phone number..."
                                value={dialNumber}
                                onChange={(e) => setDialNumber(e.target.value)}
                                className="h-10 text-base font-mono text-center font-bold tracking-wider"
                            />
                        </div>

                        {/* Keypad Grid */}
                        <div className="grid grid-cols-3 gap-2 px-2">
                            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                                <button
                                    key={digit}
                                    onClick={() => handleKeyPress(digit)}
                                    className="h-11 rounded-lg bg-muted/50 hover:bg-muted font-mono text-base font-bold text-foreground flex items-center justify-center transition-colors shadow-2xs active:scale-95"
                                >
                                    {digit}
                                </button>
                            ))}
                        </div>

                        {/* Dial Button */}
                        <Button
                            disabled={!dialNumber || callState !== 'idle'}
                            onClick={handleCall}
                            className="h-10 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 mt-1"
                        >
                            <RiPhoneFill className="size-4" />
                            <span>Initiate Call</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="relative mb-1">
                            <RiSearchLine className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                            <Input placeholder="Filter call history..." className="pl-8 h-8 text-xs bg-background" />
                        </div>

                        {[
                            { phone: '+255 712 345 678', time: '13:42', type: 'inbound', duration: '03:15' },
                            { phone: '+255 754 987 654', time: '12:10', type: 'outbound', duration: '01:40' },
                            { phone: '+255 688 112 233', time: '11:05', type: 'missed', duration: '00:00' },
                        ].map((log, idx) => (
                            <div
                                key={idx}
                                className="p-2 rounded-md bg-muted/40 hover:bg-muted border border-border flex items-center justify-between cursor-pointer transition-colors"
                                onClick={() => setDialNumber(log.phone)}
                            >
                                <div className="flex flex-col">
                                    <span className="font-semibold font-mono text-foreground">{log.phone}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        {log.time} • {log.type}
                                    </span>
                                </div>
                                <span className="font-mono text-[11px] text-muted-foreground">{log.duration}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
