// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  base: './', // required by Electron
  markdown: {
    processor: unified(),
  },
  site: 'https://singbaobao.com',
  integrations: [react()]
});
