import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RoutingDestination, RoutingDestinationType } from '@/domain/routing-types';

const DESTINATION_TYPES: RoutingDestinationType[] = ['Queue', 'Extension', 'IVR', 'Recording', 'Hangup'];

/** Placeholder values per destination type for guidance. */
const DESTINATION_PLACEHOLDERS: Record<RoutingDestinationType, string> = {
    Queue: 'Queue name, e.g. Customer Support',
    Extension: 'Extension, e.g. 8001',
    IVR: 'IVR name, e.g. Billing Menu',
    Recording: 'Recording id',
    Hangup: 'Hangup',
};

export interface RoutingDestinationSelectProps {
    id?: string;
    label: string;
    value?: RoutingDestination;
    onChange: (destination: RoutingDestination | undefined) => void;
}

/**
 * Shared destination picker for routing config (IVR entries, time conditions).
 * Exposes only supported destination types; preserves the original value string.
 */
export function RoutingDestinationSelect({ id, label, value, onChange }: RoutingDestinationSelectProps) {
    const type = value?.type ?? 'Queue';
    const val = value?.value ?? '';

    const handleTypeChange = (nextType: RoutingDestinationType) => {
        onChange({ type: nextType, value: nextType === 'Hangup' ? 'Hangup' : '' });
    };

    return (
        <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold">{label}</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Select value={type} onValueChange={(next) => handleTypeChange((next as RoutingDestinationType) ?? 'Queue')}>
                    <SelectTrigger className="w-full sm:w-36 h-9 text-xs" aria-label={`${label} type`}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {DESTINATION_TYPES.map((destinationType) => (
                            <SelectItem key={destinationType} value={destinationType} className="text-xs">
                                {destinationType}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {type !== 'Hangup' && (
                    <Input
                        id={id}
                        value={val}
                        onChange={(e) => onChange({ type, value: e.target.value })}
                        placeholder={DESTINATION_PLACEHOLDERS[type]}
                        className="h-9 text-xs flex-1"
                    />
                )}
            </div>
        </div>
    );
}
