import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$cmp: resolve('./src/components/'),
			$src: resolve('./src/'),
			$stores: resolve('./src/stores/'),
			$utils: resolve('./src/utils/')
		}
	},
	optimizeDeps: {
		exclude: ['@specy/liquid-glass']
	}
});
