import { defineConfig } from 'astro/config';
import astroI18next from "astro-i18next";
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import vue from "@astrojs/vue";

// https://astro.build/config
export default defineConfig({
	site: 'https://analogium.xyz',
	integrations: [mdx(), sitemap(), astroI18next(), vue({
		ssr: false,
	})]
});