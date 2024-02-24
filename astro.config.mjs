import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
	site: 'https://analogium.xyz',
	integrations: [mdx(), 
	vue({
		ssr: false,
	})
	]
});