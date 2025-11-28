import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg'],
			manifest: {
				name: 'Personal Finance Tracker',
				short_name: 'Finance',
				description: 'Track income and expenses offline-first',
				display: 'standalone',
				background_color: '#0f172a',
				theme_color: '#0ea5e9',
				icons: [
					{ src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
					{ src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
				]
			}
		})
	],
	server: { port: 5173, host: true, allowedHosts: true },
	preview: { port: 5173, host: true }
});
