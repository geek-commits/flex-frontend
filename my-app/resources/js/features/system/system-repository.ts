import { SYSTEM_MOCK } from '@/data/system.mock';
import type { SystemData } from './system-types';

/**
 * System & Infrastructure repository boundary.
 *
 * POC MOCK — operates on the in-memory synthetic dataset. The real backend must
 * implement the same contract later. No HTTP API is faked; the backend remains
 * authoritative for live service health, server resources, backup state, and
 * TLS/gateway connections. Never exposes SIP credentials or private keys.
 */
export interface SystemRepository {
    getData(): SystemData;
    getServices(): SystemData['services'];
    getServerResources(): SystemData['serverResources'];
    getBackups(): SystemData['backups'];
    getSummary(): SystemData['summary'];
}

export const systemRepository: SystemRepository = {
    getData() {
        return SYSTEM_MOCK;
    },
    getServices() {
        return SYSTEM_MOCK.services;
    },
    getServerResources() {
        return SYSTEM_MOCK.serverResources;
    },
    getBackups() {
        return SYSTEM_MOCK.backups;
    },
    getSummary() {
        return SYSTEM_MOCK.summary;
    },
};