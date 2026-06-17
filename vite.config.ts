import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { pocketbaseTypegenPlugin } from './.slc-development/my-vite-plugin';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), pocketbaseTypegenPlugin()],
	server: {
		watch: {
			ignored: [
				'**/.slc-development/**',
				'**/.slc-local/**',
				'**/.slc-production/pocketbase/pb_data/**'
			]
		}
	}
});
