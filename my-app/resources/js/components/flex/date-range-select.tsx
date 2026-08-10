import { RiCalendarCheckLine, RiCloseLine } from '@remixicon/react';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { DateSelector  } from '@/components/reui/date-selector';
import type {DateSelectorValue} from '@/components/reui/date-selector';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DateRangeSelectProps {
    from?: string;
    to?: string;
    onRangeChange: (from?: string, to?: string) => void;
}

const toDateInput = (date: Date) => format(date, 'yyyy-MM-dd');

export function DateRangeSelect({ from, to, onRangeChange }: DateRangeSelectProps) {
    const handleChange = useCallback(
        (value: DateSelectorValue) => {
            if (value.startDate && value.endDate) {
                onRangeChange(toDateInput(value.startDate), toDateInput(value.endDate));
            } else if (value.startDate) {
                onRangeChange(toDateInput(value.startDate), undefined);
            }
        },
        [onRangeChange]
    );

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <RiCalendarCheckLine className="size-3.5" />
                        {from || to ? `${from ?? '…'} → ${to ?? '…'}` : 'Date range'}
                        {(from || to) && (
                            <RiCloseLine
                                className="size-3.5 text-muted-foreground"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRangeChange(undefined, undefined);
                                }}
                            />
                        )}
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-3">
                <DateSelector
                    presetMode="between"
                    periodTypes={['day']}
                    showInput={false}
                    showTwoMonths
                    onChange={handleChange}
                />
            </PopoverContent>
        </Popover>
    );
}
