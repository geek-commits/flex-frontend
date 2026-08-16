import React from 'react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AiSubPage } from '@/features/ai/ai-sub-page';
import { useAiCenter } from '@/features/ai/use-ai-center';

const formatTime = (iso: string) =>
    new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AiAuditPage() {
    const { data } = useAiCenter();
    const { audit } = data;

    return (
        <AiSubPage
            title="AI Audit"
            subtitle="AI configuration and action history"
        >
            <div className="flex flex-col gap-6 w-full">
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Audit Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {audit.length === 0 ? (
                            <FlexEmptyState
                                title="No audit records"
                                description="AI configuration and action history will appear here."
                                className="py-10"
                            />
                        ) : (
                            <div className="divide-y divide-border">
                                {audit.map((record) => (
                                    <div key={record.id} className="flex items-start justify-between gap-3 p-3 px-4">
                                        <div className="flex flex-col gap-0.5 min-w-0">
                                            <span className="text-sm font-medium text-foreground">{record.action}</span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {record.detail} · {record.actor}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
                                            {formatTime(record.at)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AiSubPage>
    );
}