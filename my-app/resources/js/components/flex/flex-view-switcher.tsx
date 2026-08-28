import * as React from 'react';
import type { FlexIconName } from '@/components/flex/iconography';
import { FlexIcon } from '@/components/flex/iconography';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

export interface FlexViewSwitcherOption {
    value: string;
    label: string;
    icon?: FlexIconName | React.ComponentType<{ className?: string }>;
}

export interface FlexViewSwitcherProps {
    value: string;
    onValueChange: (value: string) => void;
    options: FlexViewSwitcherOption[];
    ariaLabel?: string;
    className?: string;
}

/**
 * Plane-pivot capsule view switcher.
 * Container: bg-flex-workspace-surface-muted p-0.5 rounded-lg border border-flex-workspace-divider
 * Active item: bg-flex-workspace-surface border border-flex-workspace-divider shadow-flex-overlay text-flex-text-primary
 * Inactive: text-flex-text-muted hover:bg-flex-layer-hover
 *
 * Maps to RESEARCH.md §4.5 / §7.3 — single capsule replaces N toolbar buttons.
 */
export function FlexViewSwitcher({ value, onValueChange, options, ariaLabel = 'View', className }: FlexViewSwitcherProps) {
    return (
        <ToggleGroup
            type="single"
            value={value}
            onValueChange={(next) => {
                if (next) {
                    onValueChange(next);
                }
            }}
            aria-label={ariaLabel}
            className={cn(
                'inline-flex items-center gap-0.5 rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface-muted p-0.5',
                className
            )}
        >
            {options.map((opt) => {
                const isActive = opt.value === value;
                const Icon = opt.icon;

                return (
                    <ToggleGroupItem
                        key={opt.value}
                        value={opt.value}
                        aria-label={opt.label}
                        className={cn(
                            'h-6 min-w-7 gap-1.5 rounded-md border px-2 text-xs font-medium transition-colors duration-[var(--flex-duration-fast)]',
                            isActive
                                ? 'border-flex-workspace-divider bg-flex-workspace-surface text-flex-text-primary shadow-flex-overlay data-[state=on]:bg-flex-workspace-surface'
                                : 'border-transparent bg-transparent text-flex-text-muted hover:bg-flex-layer-hover hover:text-flex-text-primary data-[state=on]:bg-transparent'
                        )}
                    >
                        {Icon ? (
                            typeof Icon === 'string' ? (
                                <FlexIcon name={Icon as FlexIconName} className="size-3.5" />
                            ) : (
                                <Icon className="size-3.5" />
                            )
                        ) : null}
                        <span className="hidden sm:inline">{opt.label}</span>
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
}
