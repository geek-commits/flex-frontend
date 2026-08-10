import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsCard({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <Card className="bg-card border-border shadow-2xs">
            <CardHeader className="border-b border-border">
                <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
                {description && (
                    <CardDescription className="text-xs text-muted-foreground">{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="pt-4">{children}</CardContent>
        </Card>
    );
}
