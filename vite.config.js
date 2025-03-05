import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import { defineConfig, loadEnv } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default async ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [vue(), vueDevTools(), tailwindcss],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 5588,
      proxy: {
        '/api/v1/ws/server': {
          target: env.VITE_BASE_API_WS,
          changeOrigin: true,
          rewriteWsOrigin: true,
          ws: true,
        },
        '/api/v1': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
        },
      },
    },
  })
}
