import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
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
});
