import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('shell integrity — one shell invariant (static audit)', () => {
    const legacyShellPath = path.resolve(
        __dirname,
        '../../components/flex/flex-app-shell.tsx',
    );
    const railPath = path.resolve(
        __dirname,
        '../../components/flex/primary-rail.tsx',
    );
    const contextSidebarPath = path.resolve(
        __dirname,
        '../../components/flex/context-sidebar.tsx',
    );
    const topbarPath = path.resolve(
        __dirname,
        '../../components/flex/app-topbar.tsx',
    );
    const pageHeaderPath = path.resolve(
        __dirname,
        '../../components/flex/flex-page-header.tsx',
    );
    const appShellPath = path.resolve(
        __dirname,
        '../../components/app-shell.tsx',
    );
    const appSidebarPath = path.resolve(
        __dirname,
        '../../components/app-sidebar.tsx',
    );
    const appHeaderPath = path.resolve(
        __dirname,
        '../../components/app-header.tsx',
    );
    const appLayoutPath = path.resolve(__dirname, '../app-layout.tsx');
    const agentShellPath = path.resolve(__dirname, '../agent-shell.tsx');
    const adminShellPath = path.resolve(__dirname, '../admin-shell.tsx');
    const legacyShellContent = fs.readFileSync(legacyShellPath, 'utf8');
    const railContent = fs.readFileSync(railPath, 'utf8');
    const contextSidebarContent = fs.readFileSync(contextSidebarPath, 'utf8');
    const topbarContent = fs.readFileSync(topbarPath, 'utf8');
    const pageHeaderContent = fs.readFileSync(pageHeaderPath, 'utf8');
    const appShellContent = fs.readFileSync(appShellPath, 'utf8');
    const appSidebarContent = fs.readFileSync(appSidebarPath, 'utf8');
    const appHeaderContent = fs.readFileSync(appHeaderPath, 'utf8');
    const appLayoutContent = fs.readFileSync(appLayoutPath, 'utf8');
    const agentShellContent = fs.readFileSync(agentShellPath, 'utf8');
    const adminShellContent = fs.readFileSync(adminShellPath, 'utf8');

    it('renders every signed-in layout through the universal AppShell', () => {
        expect(appShellContent).toContain('data-flex-shell');
        expect(appShellContent).toContain('data-flex-workspace');
        expect(appShellContent).toContain('<SidebarProvider');
        expect(appShellContent).toContain('<AppSidebar');
        expect(appShellContent).toContain('<AppHeader');
        expect(appHeaderContent).toContain('data-flex-global-header');
        expect(appSidebarContent).toContain('collapsible="icon"');
        expect(appSidebarContent).toContain('variant="inset"');
        expect(pageHeaderContent).toContain('data-flex-page-header');
        expect(appLayoutContent).toContain('<AppShell');
        expect(appLayoutContent).not.toContain('FlexAppShell');
        expect(agentShellContent).toContain('<AppShell');
        expect(agentShellContent).toContain('mode="agent"');
        expect(agentShellContent).not.toContain('FlexAppShell');
        expect(adminShellContent).toContain('<AppShell');
        expect(adminShellContent).not.toContain('FlexAppShell');
        // ensure no sensitive runtime leaked into attributes
        expect(appShellContent).not.toMatch(
            /data-flex-shell.*callId|tenantId|phone/i,
        );
    });

    it('keeps the legacy shell as reference only (off the auth path)', () => {
        // Files stay on disk for rollback reference, but no signed-in
        // layout may import them.
        expect(legacyShellContent).toContain('data-flex-shell');
        expect(legacyShellContent).toContain('<PrimaryRail />');
        expect(legacyShellContent).toContain('<ContextSidebar />');
        expect(legacyShellContent).toContain('<AppTopbar');
        expect(legacyShellContent).toContain('data-flex-workspace');
        expect(legacyShellContent).toContain('<ShellProvider>');
        expect(railContent).toContain('data-flex-primary-rail');
        expect(contextSidebarContent).toContain('data-flex-context-sidebar');
        expect(topbarContent).toContain('data-flex-global-header');
        expect(appLayoutContent).not.toContain(
            "from '@/components/flex/flex-app-shell'",
        );
        expect(agentShellContent).not.toContain(
            "from '@/components/flex/flex-app-shell'",
        );
        expect(adminShellContent).not.toContain(
            "from '@/components/flex/flex-app-shell'",
        );
        expect(railContent).toContain('<ContextSidebarToggle');
        expect(contextSidebarContent).toContain('<ContextSidebarToggle');
        expect(contextSidebarContent).toContain('aria-hidden');
        expect(contextSidebarContent).toContain('inert');
    });

    it('uses the full FLEX wordmark expanded and the monogram collapsed', () => {
        expect(appSidebarContent).toContain('<FlexBrandLogo');
        expect(appSidebarContent).toContain("'collapsed'");
        expect(topbarContent).toContain('<FlexBrandLogo');
        expect(topbarContent).toContain('variant="static"');
        expect(railContent).not.toContain('FlexBrandMark');
        expect(railContent).not.toContain('f-monogram');
    });

    it('keeps markers purely structural (no IDs)', () => {
        expect(appShellContent).not.toMatch(
            /data-flex-shell.*tenantId|phone|callId/,
        );
        expect(appShellContent).toContain('data-flex-shell-domain');
        expect(appShellContent).toContain('data-flex-shell-route');
    });
});
