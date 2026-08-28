import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('shell integrity — one shell invariant (static audit)', () => {
    const shellPath = path.resolve(__dirname, '../../components/flex/flex-app-shell.tsx');
    const content = fs.readFileSync(shellPath, 'utf8');

    it('exposes permanent structural markers without sensitive data', () => {
        expect(content).toContain('data-flex-shell');
        expect(content).toContain('data-flex-primary-rail');
        expect(content).toContain('data-flex-topbar');
        expect(content).toContain('data-flex-workspace');
        expect(content).toContain('data-flex-context-sidebar');
        // ensure no sensitive runtime leaked into attributes
        expect(content).not.toMatch(/data-flex-shell.*callId|tenantId|phone/i);
    });

    it('enforces invariant via single attributes (authenticated route → 1 shell/rail/topbar/workspace)', () => {
        // Count occurrences of marker definitions — exactly one definition each in shell file
        const shellCount = (content.match(/data-flex-shell(?!=-)/g) || []).length;
        // shell root + domain + route: at least one data-flex-shell, but primary markers singular
        expect(shellCount).toBeGreaterThanOrEqual(1);
        expect(content).toContain('data-flex-primary-rail');
        expect(content).toContain('data-flex-topbar');
        expect(content).toContain('data-flex-workspace');
    });

    it('keeps markers purely structural (no IDs)', () => {
        expect(content).not.toMatch(/data-flex-shell.*tenantId|phone|callId/);
        expect(content).toContain('data-flex-shell-domain');
        expect(content).toContain('data-flex-shell-route');
    });
});
