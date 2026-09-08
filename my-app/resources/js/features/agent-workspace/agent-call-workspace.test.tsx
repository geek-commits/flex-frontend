import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AgentCallWorkspace } from './agent-call-workspace';

const mocks = vi.hoisted(() => ({
    callState: 'idle',
    isMobile: false,
    isMinimized: false,
    restoreAssist: vi.fn(),
}));

vi.mock('@/hooks/use-mobile', () => ({
    useIsMobile: () => mocks.isMobile,
}));

vi.mock('./state/use-workspace-state', () => ({
    useWorkspaceState: () => ({ callState: mocks.callState }),
}));

vi.mock('./agent-assist/agent-assist-session-context', () => ({
    useAgentAssistSession: () => ({
        isMinimized: mocks.isMinimized,
        restoreAssist: mocks.restoreAssist,
    }),
}));

vi.mock('./call-manager/call-manager', () => ({
    CallManager: () => <div data-testid="call-manager">Call Manager</div>,
}));

vi.mock('./agent-assist/agent-assist-dock', () => ({
    AgentAssistDock: () => <div data-testid="agent-assist-dock">Agent Assist</div>,
}));

describe('AgentCallWorkspace', () => {
    beforeEach(() => {
        mocks.callState = 'idle';
        mocks.isMobile = false;
        mocks.isMinimized = false;
        mocks.restoreAssist.mockReset();
    });

    it('keeps the Assist pane out of non-supported call states', () => {
        const { rerender } = render(<AgentCallWorkspace />);

        for (const callState of ['idle', 'dialing', 'ringing', 'connecting', 'wrap-up']) {
            mocks.callState = callState;
            rerender(<AgentCallWorkspace />);

            expect(screen.queryByTestId('agent-call-workspace')).not.toBeInTheDocument();
            expect(screen.getByTestId('call-manager')).toBeInTheDocument();
        }
    });

    it.each(['connected', 'hold', 'transferring'])('stacks panes for %s', (callState) => {
        mocks.callState = callState;

        render(<AgentCallWorkspace />);

        expect(document.querySelector('[data-agent-call-workspace]')).toHaveClass(
            'grid-rows-[minmax(0,3fr)_1px_minmax(0,2fr)]',
        );
        expect(screen.getByRole('region', { name: 'Call Manager' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Agent Assist' })).toBeInTheDocument();
        expect(screen.getByTestId('agent-assist-dock')).toBeInTheDocument();
    });

    it('collapses Assist into a keyboard-accessible restore bar', () => {
        mocks.callState = 'connected';
        mocks.isMinimized = true;

        render(<AgentCallWorkspace />);

        expect(document.querySelector('[data-agent-call-workspace]')).toHaveClass(
            'grid-rows-[minmax(0,1fr)_auto]',
        );
        expect(screen.queryByTestId('agent-assist-dock')).not.toBeInTheDocument();

        const showButton = screen.getByRole('button', { name: /Agent Assist Show/i });
        expect(showButton).toHaveAttribute('aria-expanded', 'false');
        fireEvent.click(showButton);
        expect(mocks.restoreAssist).toHaveBeenCalledOnce();
    });

    it('keeps mobile on the unified Call Manager surface', () => {
        mocks.callState = 'connected';
        mocks.isMobile = true;

        render(<AgentCallWorkspace />);

        expect(screen.queryByTestId('agent-call-workspace')).not.toBeInTheDocument();
        expect(screen.getByTestId('call-manager')).toBeInTheDocument();
        expect(screen.queryByTestId('agent-assist-dock')).not.toBeInTheDocument();
    });
});
