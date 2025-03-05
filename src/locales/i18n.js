import { createI18n } from 'vue-i18n'

async function loadLocaleMessages() {
  const modules = import.meta.glob('./langs/*.json')
  const messages = {}
  for (const path in modules) {
    const match = path.match(/\.\/langs\/(.*)\.json$/)
    if (match) {
      const [fileName, locale] = match
      if (locale && fileName && modules[path]) {
        messages[locale] = (await modules[path]())?.default
      }
    }
  }

  return messages
}

// 创建一个初始化函数
let i18n = null

export async function setupI18n() {
  if (i18n !== null) return i18n

  const messages = await loadLocaleMessages()

  i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('CUSTOM_LANGUAGE') || 'zh-CN',
    messages: messages,
    fallbackLocale: 'zh-CN',
  })

  return i18n
}

export async function setI18nLanguage(locale) {
  if (i18n) {
    i18n.global.locale.value = locale
    localStorage.setItem('CUSTOM_LANGUAGE', locale)
    document?.querySelector('html')?.setAttribute('lang', locale)
  }
}

export default { setupI18n, setI18nLanguage }
