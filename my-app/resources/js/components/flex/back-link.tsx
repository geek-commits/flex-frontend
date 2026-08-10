import { Link } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';

export function BackLink({ href, label }: { href: string; label: string }) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs text-muted-foreground w-fit"
            render={<Link href={href} />}
        >
            <RiArrowLeftLine className="size-3.5" />
            {label}
        </Button>
    );
}
