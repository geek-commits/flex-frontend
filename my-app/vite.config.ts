import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
            '@assets': fileURLToPath(new URL('./resources/assets', import.meta.url)),
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        svgr({
            include: ['**/flex/icons/**/*.svg?react', '**/assets/social/**/*.svg?react'],
            svgrOptions: {
                exportType: 'default',
                svgProps: {
                    'aria-hidden': true,
                    focusable: 'false',
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
    ],
});
