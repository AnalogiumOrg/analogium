import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
	site: 'https://analogium.xyz',
	integrations: [mdx(), sitemap(),
	vue({
			ssr: false,
		})
	],
});
