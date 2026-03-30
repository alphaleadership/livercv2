import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'path';
import { fileURLToPath, URL } from 'node:url';
import mediawikiUserscript from 'vite-plugin-mediawiki-userscript';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { readFileSync } from 'fs';
export default defineConfig({
  plugins: [
    vue(),vueJsx(),
    mediawikiUserscript( {
			name: 'liverc2',
			entry: './src/main.ts',
			using: [
				'vue',
			
				'@wikimedia/codex',
				'mediawiki.util','mediawiki.api' // MediaWiki modules
			],
			banner: readFileSync( './BANNER.txt', 'utf8' )
		} )

  ],
  resolve: {
		alias: {
			// eslint-disable-next-line es-x/no-import-meta
			'@': fileURLToPath( new URL( './src', import.meta.url ) )
		}
	},


});
