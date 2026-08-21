import { describe, expect, it } from 'vitest';
import { agentStateMap, aiFeatureStatusMap, campaignStatusMap, connectionStateMap } from './status-styles';

describe('status-styles', () => {
    it('agentStateMap covers all agent states', () => {
        expect(Object.keys(agentStateMap)).toEqual(expect.arrayContaining(['ready', 'talking', 'ringing', 'wrap-up', 'break', 'not-ready', 'offline']));
    });

    it('connectionStateMap maps reconnecting to stale tone', () => {
        expect(connectionStateMap.reconnecting.dotClass).toBe(connectionStateMap.stale.dotClass);
    });

    it('campaignStatusMap active is live tone', () => {
        expect(campaignStatusMap.active.bgClass).toContain('live');
    });

    it('aiFeatureStatusMap configuration-required is talking tone', () => {
        expect(aiFeatureStatusMap['configuration-required'].bgClass).toContain('talking');
    });
});
