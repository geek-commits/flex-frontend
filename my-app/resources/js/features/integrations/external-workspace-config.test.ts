import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { resolveExternalWorkspaceStatus } from './use-external-workspace-state';

type IntegrationConfig = {
    iframeConfig: {
        sandbox: string;
        src: string;
    };
};

function readIntegrationConfig(name: 'crm-primary' | 'social-primary'): IntegrationConfig {
    const configPath = path.resolve(
        __dirname,
        `../../../../public/integrations/${name}.json`,
    );

    return JSON.parse(fs.readFileSync(configPath, 'utf8')) as IntegrationConfig;
}

describe('external workspace integration configuration', () => {
    it.each([
        ['crm-primary', 'https://demo-crm.flex.co.tz/'],
        ['social-primary', 'https://demo-chat.flex.co.tz/'],
    ] as const)('opens %s at its externally owned root route', (name, expectedSrc) => {
        const config = readIntegrationConfig(name);

        expect(config.iframeConfig.src).toBe(expectedSrc);
        expect(config.iframeConfig.src).not.toContain('/login');
    });

    it.each(['crm-primary', 'social-primary'] as const)(
        'keeps %s inside the host sandbox',
        (name) => {
            const config = readIntegrationConfig(name);

            expect(config.iframeConfig.sandbox).not.toContain('allow-top-navigation');
        },
    );

    it('uses the honest local fallback without changing external configuration', () => {
        const config = readIntegrationConfig('crm-primary');

        expect(resolveExternalWorkspaceStatus(config, true)).toBe('local-fallback');
        expect(resolveExternalWorkspaceStatus(config, false)).toBe('loading');
    });
});
