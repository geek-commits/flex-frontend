import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@/i18n';
import { ContactCenterTrafficChart } from '@/features/dashboard/contact-center-traffic-chart';

const dashboardState = vi.hoisted(() => ({
    refresh: vi.fn(),
}));

vi.mock('@/features/dashboard/use-dashboard-data', () => ({
    useDashboardData: () => ({
        data: null,
        isLoading: false,
        error: new Error('Unavailable'),
        isRefreshing: false,
        refresh: dashboardState.refresh,
    }),
}));

describe('Dashboard recovery', () => {
    beforeEach(() => dashboardState.refresh.mockClear());

    it('retries the dashboard data request in place', () => {
        render(<ContactCenterTrafficChart />);

        fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

        expect(dashboardState.refresh).toHaveBeenCalledOnce();
    });
});
