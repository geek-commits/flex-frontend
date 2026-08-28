import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { QueuePressureSection } from './queue-pressure';

describe('QueuePressureSection', () => {
    it('renders empty state when queues is empty (not fallback bug)', () => {
        render(
            <I18nextProvider i18n={i18n}>
                <QueuePressureSection queues={[]} />
            </I18nextProvider>,
        );
        // Should show translated empty, not render empty div via queues.map || <Empty>
        expect(screen.getByText('Queue Pressure')).toBeInTheDocument();
        expect(screen.getByText('No queue data available.')).toBeInTheDocument();
    });

    it('renders queues when data exists', () => {
        render(
            <I18nextProvider i18n={i18n}>
                <QueuePressureSection
                    queues={[
                        { queue: 'Support', waiting: 2, longestWait: 65, availableAgents: 1, totalAgents: 3, sla: 92 },
                    ]}
                />
            </I18nextProvider>,
        );
        expect(screen.getByText('Support')).toBeInTheDocument();
        expect(screen.getByText('Waiting')).toBeInTheDocument();
    });
});
