import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { FlexBarChart } from '@/components/flex/charts/flex-bar-chart';

vi.mock('@visx/responsive', () => ({
    ParentSize: () => null,
}));

describe('FlexBarChart', () => {
    it('exposes an accessible chart name', () => {
        render(
            <FlexBarChart
                ariaLabel="Answered and abandoned calls"
                data={[]}
                series={[]}
                xDataKey="date"
            />,
        );

        expect(
            screen.getByRole('img', {
                name: 'Answered and abandoned calls',
            }),
        ).toBeInTheDocument();
    });
});
