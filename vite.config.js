import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from "vite-plugin-pwa";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(
      {
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,webp}'],
        },
        build: {
          rollupOptions: {
            output: {
              assetFileNames: `assets/[name].[ext]`
            }
          }
        },
        manifest: {
          name: 'Satellite Tracker',
          short_name: 'Platzi-Sat1-Tracker',
          description: 'Satellite Tracker',
          background_color: '#090909',
          theme_color: '#090909',
          icons: [
            {
              src: '/Icon-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/Icon-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: '/Icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            },

          ],
          handler: "CacheFirst",
          devOptions: {
            enabled: true
          }
        }
      }
    )
  ],
})