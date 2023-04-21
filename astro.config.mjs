import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
	site: 'https://analogium.xyz',
	integrations: [mdx(), sitemap(), astroI18next()],
});
