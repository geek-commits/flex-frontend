import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('shell integrity — one shell invariant (static audit)', () => {
    const shellPath = path.resolve(__dirname, '../../components/flex/flex-app-shell.tsx');
    const railPath = path.resolve(__dirname, '../../components/flex/primary-rail.tsx');
    const contextSidebarPath = path.resolve(__dirname, '../../components/flex/context-sidebar.tsx');
    const shellContent = fs.readFileSync(shellPath, 'utf8');
    const railContent = fs.readFileSync(railPath, 'utf8');
    const contextSidebarContent = fs.readFileSync(contextSidebarPath, 'utf8');

    it('exposes permanent structural markers without sensitive data', () => {
        expect(shellContent).toContain('data-flex-shell');
        expect(shellContent).toContain('data-flex-topbar');
        expect(shellContent).toContain('data-flex-workspace');
        expect(railContent).toContain('data-flex-primary-rail');
        expect(contextSidebarContent).toContain('data-flex-context-sidebar');
        // ensure no sensitive runtime leaked into attributes
        expect(shellContent).not.toMatch(/data-flex-shell.*callId|tenantId|phone/i);
    });

    it('enforces invariant via single attributes (authenticated route → 1 shell/rail/topbar/workspace)', () => {
        // Markers are owned by their dedicated structural components, not a
        // combined vendor sidebar.
        const shellCount = (shellContent.match(/data-flex-shell(?!=-)/g) || []).length;
        expect(shellCount).toBeGreaterThanOrEqual(1);
        expect(shellContent).toContain('<PrimaryRail />');
        expect(shellContent).toContain('<ContextSidebar />');
        expect(railContent).toContain('data-flex-primary-rail');
        expect(contextSidebarContent).toContain('data-flex-context-sidebar');
        expect(shellContent).toContain('data-flex-topbar');
        expect(shellContent).toContain('data-flex-workspace');
    });

    it('keeps markers purely structural (no IDs)', () => {
        expect(shellContent).not.toMatch(/data-flex-shell.*tenantId|phone|callId/);
        expect(shellContent).toContain('data-flex-shell-domain');
        expect(shellContent).toContain('data-flex-shell-route');
    });
});
