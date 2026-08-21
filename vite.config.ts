import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { markdownImagePreviews } from './scripts/markdown-images.js';

export default defineConfig({
    server: {
        port: 3000,
        allowedHosts: [],
    },
    plugins: [
        markdownImagePreviews(),
        sveltekit(),
        Icons({
            compiler: 'svelte',
            defaultStyle: 'width: 100%; height: auto; max-height: 100%;',
        }),
    ],
    resolve: {
        alias: {
            $cmp: resolve('./src/components/'),
            $src: resolve('./src/'),
            $stores: resolve('./src/stores/'),
            $utils: resolve('./src/utils/'),
        },
    },
});
