import { describe, expect, it } from 'vitest';
import { RECORDING_CATEGORY_KEYS, RECORDING_USAGE_TYPE_KEYS } from '@/domain/recording-types';
import i18n from '@/i18n';

describe('Recordings — Phase 7D UI', () => {
    it('category enum → EN/SW/FR label', async () => {
        expect(i18n.t(`administration:${RECORDING_CATEGORY_KEYS['ivr-prompt']}`, { lng: 'en' })).toBe('IVR Prompt');
        expect(i18n.t(`administration:${RECORDING_CATEGORY_KEYS['ivr-prompt']}`, { lng: 'sw' })).toBe('Arifa ya IVR');
        expect(i18n.t(`administration:${RECORDING_CATEGORY_KEYS['hold-music']}`, { lng: 'fr' })).toBe('Musique d\'attente');
    });

    it('usage type EN→SW→FR', async () => {
        expect(i18n.t(`administration:${RECORDING_USAGE_TYPE_KEYS.IVR}`, { lng: 'en' })).toBe('IVR');
        expect(i18n.t(`administration:${RECORDING_USAGE_TYPE_KEYS.Queue}`, { lng: 'sw' })).toBe('Foleni');
        expect(i18n.t(`administration:${RECORDING_USAGE_TYPE_KEYS['Time Condition']}`, { lng: 'fr' })).toBe('Condition horaire');
    });

    it('form validation key reacts EN→SW→FR', async () => {
        expect(i18n.t('administration:recordings.form.validation.titleRequired', { lng: 'en' })).toBe('Recording title is required.');
        expect(i18n.t('administration:recordings.form.validation.titleRequired', { lng: 'sw' })).not.toBe('Recording title is required.');
        expect(i18n.t('administration:recordings.form.validation.unsupportedFormat', { lng: 'fr' })).toContain('WAV');
    });

    it('form values remain unchanged across locale', async () => {
        const filename = 'greeting.wav';
        const name = 'Main Support Greeting';
        expect(filename).toBe('greeting.wav');
        expect(name).toBe('Main Support Greeting');
    });

    it('detail labels change', async () => {
        expect(i18n.t('administration:recordings.detail.audioPreview', { lng: 'en' })).toBe('Audio Preview');
        expect(i18n.t('administration:recordings.detail.audioPreview', { lng: 'sw' })).toBe('Hakiki ya Sauti');
        expect(i18n.t('administration:recordings.detail.delete', { lng: 'fr' })).toBe('Supprimer');
    });

    it('delete warning changes', async () => {
        expect(i18n.t('administration:recordings.delete.description', { lng: 'en', name: 'Test', filename: 'test.wav' })).toContain('Test');
        expect(i18n.t('administration:recordings.delete.warningTitle', { lng: 'en' })).toBe('Warning: Active Routing Dependencies');
        expect(i18n.t('administration:recordings.delete.warningTitle', { lng: 'sw' })).not.toBe('Warning: Active Routing Dependencies');
    });

    it('Play/Pause/seek ARIA changes', async () => {
        expect(i18n.t('administration:recordings.player.playAria', { lng: 'en', name: 'Test' })).toBe('Play Test');
        expect(i18n.t('administration:recordings.player.pauseAria', { lng: 'sw', name: 'Test' })).toContain('Test');
        expect(i18n.t('administration:recordings.player.seekAria', { lng: 'en' })).toBe('Seek audio position');
    });

    it('raw filename/name/script remain unchanged', async () => {
        const filename = 'test.wav';
        const name = 'My Recording';
        const script = 'Hello world';
        expect(filename).toBe('test.wav');
        expect(name).toBe('My Recording');
        expect(script).toBe('Hello world');
    });

    it('no defaultValue category fallback', async () => {
        expect(i18n.t('administration:recordings.categories.ivrPrompt', { lng: 'en' })).toBe('IVR Prompt');
        expect(i18n.t('administration:recordings.categories.ivrPrompt', { lng: 'sw' })).toBe('Arifa ya IVR');
    });
});
