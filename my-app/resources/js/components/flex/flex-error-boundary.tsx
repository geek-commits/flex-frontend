import React from 'react';
import { FlexErrorState } from './flex-error-state';

type Props = { children: React.ReactNode; feature: string; fallback?: React.ReactNode };
type State = { hasError: boolean; correlationId?: string };

/**
 * Minimal feature-level error boundary — Increment 3 scaffolding.
 * Localized failure (§11): a chart failure must not crash the shell.
 */
export class FlexErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: unknown): State {
        const cid = (error as Record<string, unknown>)?.correlationId as string | undefined;

        return { hasError: true, correlationId: cid };
    }

    componentDidCatch(error: unknown): void {
        // Observability hook (ADR-driven future): emit without sensitive payloads
        // emitObservability({ event_name: 'route_load_failed', feature: this.props.feature, severity: 'error' })
        void error;
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <FlexErrorState
                        title="Something went wrong"
                        description={this.state.correlationId ? `Try refreshing this section. Ref: ${this.state.correlationId}` : 'Try refreshing this section.'}
                    />
                )
            );
        }

        return this.props.children;
    }
}
