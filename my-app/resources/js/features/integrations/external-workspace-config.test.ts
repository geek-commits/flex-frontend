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
        ['crm-primary', 'https://demo-crm.flex.co.tz/login'],
        ['social-primary', 'https://demo-chat.flex.co.tz/login'],
    ] as const)('opens %s at its designated route', (name, expectedSrc) => {
        const config = readIntegrationConfig(name);

        expect(config.iframeConfig.src).toBe(expectedSrc);
    });

    it.each(['crm-primary', 'social-primary'] as const)(
        'keeps %s inside the host sandbox and disallows top navigation',
        (name) => {
            const config = readIntegrationConfig(name);

            expect(config.iframeConfig.sandbox).not.toContain('allow-top-navigation');
            expect(config.iframeConfig.sandbox).toContain('allow-same-origin');
            expect(config.iframeConfig.sandbox).toContain('allow-scripts');
        },
    );

    it('resolves external workspace status to loading when src is configured', () => {
        const config = readIntegrationConfig('crm-primary');

        expect(resolveExternalWorkspaceStatus(config)).toBe('loading');
    });
});
