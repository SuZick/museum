import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Помощник для сборщика моделей (models-src/builder.html):
// принимает готовый файл .glb и сохраняет его в public/models. Работает только при `npm run dev`.
function saveModelsPlugin() {
  return {
    name: 'save-models',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-model', (req, res) => {
        const name = new URL(req.url, 'http://localhost').searchParams.get('name') ?? ''
        if (req.method !== 'POST' || !/^[a-z0-9-]+$/.test(name)) {
          res.statusCode = 400
          res.end('bad request')
          return
        }
        const chunks = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          const file = path.join(server.config.root, 'public', 'models', `${name}.glb`)
          fs.writeFileSync(file, Buffer.concat(chunks))
          res.end('ok')
        })
      })
    },
  }
}

export default defineConfig({
  // Относительные пути: собранный сайт будет работать из любой папки
  // и на любом бесплатном хостинге (GitHub Pages, Netlify и т.п.).
  base: './',
  build: {
    // Готовый сайт собирается в папку docs: GitHub Pages умеет показывать сайт прямо из неё
    outDir: 'docs',
    emptyOutDir: true,
  },
  preview: {
    port: 4173,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // <model-viewer> — это готовый веб-компонент от Google, а не компонент Vue.
          // Говорим Vue, чтобы он не пытался его искать у себя.
          isCustomElement: (tag) => tag === 'model-viewer',
        },
      },
    }),
    saveModelsPlugin(),
  ],
})
