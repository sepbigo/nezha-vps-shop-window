import { setI18nLanguage } from '@/locales/i18n'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('preferences', () => {
  const preferences = ref({
    customTitle: 'VPS橱窗',
    customSubtitle: 'VPS Shop Window',
    customLogo: '',
    customLanguage: 'zh-CN',
    customTheme: 'slate',
    useSemitransparent: false,
    customNavLinks: [],
    layoutStyle: 'card',
  })

  const themeList = ref([
    'zinc',
    'slate',
    'stone',
    'gray',
    'neutral',
    'red',
    'rose',
    'orange',
    'green',
    'blue',
    'yellow',
    'violet',
  ])
  function setPreferences(data) {
    for (let key in data) {
      preferences.value[key] = data[key]
    }
  }
  async function getSemitransparent() {
    return (
      localStorage.getItem('USE_SEMITRANSPARENT') || preferences.value.useSemitransparent || false
    )
  }
  function toggleSemitransparent() {
    preferences.value.useSemitransparent = !preferences.value.useSemitransparent
    localStorage.setItem('USE_SEMITRANSPARENT', preferences.value.useSemitransparent)
  }
  function useBackgroundImage() {
    preferences.value.useSemitransparent = true
    preferences.value.customBackgroundImage = `https://picsum.photos/1920/1080?random=${Math.random()}`
  }

  function getLanguage() {
    return (
      localStorage.getItem('CUSTOM_LANGUAGE') ||
      preferences.value.customLanguage ||
      navigator.language ||
      'zh-CN'
    )
  }
  function changeLanguage(language) {
    preferences.value.customLanguage = language
    localStorage.setItem('CUSTOM_LANGUAGE', language)
    setI18nLanguage(language)
  }

  function getTheme() {
    return localStorage.getItem('CUSTOM_THEME') || preferences.value.customTheme || 'slate'
  }

  function changeTheme(theme) {
    let oldTheme = getTheme()
    document?.querySelector('html')?.classList.remove(`theme-${oldTheme}`)
    preferences.value.customTheme = theme
    document?.querySelector('html')?.classList.add(`theme-${theme}`)

    localStorage.setItem('CUSTOM_THEME', theme)
  }

  return {
    preferences,
    themeList,
    setPreferences,
    getSemitransparent,
    toggleSemitransparent,
    useBackgroundImage,
    getLanguage,
    changeLanguage,
    getTheme,
    changeTheme,
  }
})
