import 'flag-icons/css/flag-icons.min.css'
import './assets/index.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales/i18n'

async function initApp() {
  const app = createApp(App)

  app.use(createPinia())
  const i18n = await setupI18n()
  app.use(i18n)
  app.mount('#app')
}

initApp()
