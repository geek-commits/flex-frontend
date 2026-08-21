import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
            '@assets': fileURLToPath(new URL('./resources/assets', import.meta.url)),
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: ['resources/js/**/*.{test,spec}.{ts,tsx}', 'tests-js/**/*.{test,spec}.{ts,tsx}'],
        css: false,
    },
});
