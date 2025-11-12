import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const raw = process.env.BASE_PATH ?? '';
const base = raw.endsWith('/') ? raw : raw + '/';   // force trailing slash

export default defineConfig(
{ 
	plugins: [svelte()], 
	base
});
