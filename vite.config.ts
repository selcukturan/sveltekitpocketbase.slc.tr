import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteDevtools } from '@sveltejs/vite-devtools-svelte';
import { defineConfig } from 'vite';
import { pocketbaseTypegenPlugin } from './.slc-development/my-vite-plugin/index.ts';

export default defineConfig({
	devtools: { apply: 'serve' },
	plugins: [
		tailwindcss(),
		svelteDevtools(),
		sveltekit({
			adapter: adapter(),
			experimental: {
				remoteFunctions: true
			},
			compilerOptions: {
				experimental: {
					async: true
				}
			}
		}),
		pocketbaseTypegenPlugin()
	],
	server: {
		watch: {
			ignored: ['**/.slc-development/**', '**/.slc-local/**', '**/.slc-production/pocketbase/pb_data/**']
		}
	}
});
