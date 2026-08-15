import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import React from 'react';
import { FlexIcon } from '@/components/flex/iconography';
import type { FlexIconName } from '@/components/flex/iconography';
import { MetricCard, MetricGroup } from '@/components/flex/metric-card';
import { StatusBadge } from '@/components/flex/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminShell } from '@/layouts/admin-shell';
import type { AIFeatureStatus } from '@/types/flex';

export interface AIFeatureCard {
    title: string;
    description: string;
    status: AIFeatureStatus;
    icon: FlexIconName;
}

export default function AICenterPage() {
    const aiFeatures: AIFeatureCard[] = [
        {
            title: 'Global AI Gateway',
            description: 'Central LLM routing, token rate-limiting, and model fallback management.',
            status: 'enabled',
            icon: 'ai-center',
        },
        {
            title: 'Agent Assist Co-Pilot',
            description: 'Real-time call transcription, auto-suggested answers, and instant CRM lookup.',
            status: 'enabled',
            icon: 'ai-copilot',
        },
        {
            title: 'Knowledge Base (RAG)',
            description: 'Vector embeddings database powering semantic search for agent response suggestions.',
            status: 'enabled',
            icon: 'knowledge-base',
        },
        {
            title: 'Virtual Voice Assistants',
            description: 'Autonomous Conversational AI handling tier-1 inbound call inquiries.',
            status: 'configuration-required',
            icon: 'voice-assistants',
        },
    ];

    return (
        <AdminShell
            title="AI Center"
            subtitle="Agent Co-Pilot, Knowledge Base (RAG) & LLM Token Analytics"
            actions={
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <RiRefreshLine className="size-3.5" />
                    <span>Refresh Stats</span>
                </Button>
            }
        >
            <Head title="AI Center — Flex Contact Center" />

            <div className="flex flex-col gap-6 w-full">
                {/* 1. Today's AI Snapshot */}
                <div className="flex flex-col gap-2.5">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FlexIcon name="ai-snapshot" className="text-primary" />
                        <span>Today&apos;s Usage Snapshot</span>
                    </h2>

                    <MetricGroup>
                        <MetricCard
                            title="AI Sessions Today"
                            value={342}
                            description="Real-time agent co-pilot interactions"
                            trend={{ value: '18%', positive: true }}
                        />
                        <MetricCard
                            title="Assist Adoption Rate"
                            value="84.5%"
                            description="Agents actively accepting AI suggestions"
                        />
                        <MetricCard
                            title="Total Tokens Today"
                            value="1.24M"
                            description="Prompt & completion token volume"
                        />
                        <MetricCard
                            title="Est. Cost Today"
                            value="$4.82"
                            description="Inference provider cost estimate"
                        />
                    </MetricGroup>
                </div>

                {/* 2. AI Feature Status Directory */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        AI Feature Status
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiFeatures.map((feat, idx) => {
                            return (
                                <Card key={idx} className="bg-card border-border shadow-2xs">
                                    <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                                                    <FlexIcon name={feat.icon} size="lg" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-xs font-semibold text-foreground">{feat.title}</h3>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5">{feat.description}</p>
                                                </div>
                                            </div>
                                            <StatusBadge domain="ai" status={feat.status} />
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* 3. Knowledge Base Impact */}
                <Card className="bg-card border-border shadow-2xs">
                    <CardHeader className="p-4 pb-2 border-b border-border">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <FlexIcon name="knowledge-base" className="text-primary" />
                                Knowledge Base Coverage
                            </span>
                            <span className="text-xs font-semibold text-status-live">98.2% Search Precision</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Active KB Vaults</span>
                                <span className="text-lg font-bold text-foreground">4</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Knowledge Items</span>
                                <span className="text-lg font-bold text-foreground">1,280</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Queues Covered</span>
                                <span className="text-lg font-bold text-foreground">3 / 3</span>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/40 border border-border flex flex-col">
                                <span className="text-[10px] uppercase font-semibold text-muted-foreground">Updated Today</span>
                                <span className="text-lg font-bold text-status-live">12</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
