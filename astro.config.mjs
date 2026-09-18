// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  base: './', // required by Electron
  site: 'https://singbaobao.com',
  integrations: [react()]
});
