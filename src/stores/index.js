import { setI18nLanguage } from '@/locales/i18n'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 主题相关状态
export const useThemeStore = defineStore('theme', () => {
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

  const currentTheme = ref(localStorage.getItem('CUSTOM_THEME') || 'slate')

  function changeTheme(theme) {
    let oldTheme = currentTheme.value
    document?.querySelector('html')?.classList.remove(`theme-${oldTheme}`)
    currentTheme.value = theme
    document?.querySelector('html')?.classList.add(`theme-${theme}`)
    localStorage.setItem('CUSTOM_THEME', theme)
  }

  return {
    themeList,
    currentTheme,
    changeTheme,
  }
})

// 语言相关状态
export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref(
    localStorage.getItem('CUSTOM_LANGUAGE') || navigator.language || 'zh-CN',
  )

  function changeLanguage(language) {
    currentLanguage.value = language
    localStorage.setItem('CUSTOM_LANGUAGE', language)
    setI18nLanguage(language)
  }

  return {
    currentLanguage,
    changeLanguage,
  }
})

// UI相关状态
export const useUIStore = defineStore('ui', () => {
  const useSemitransparent = ref(localStorage.getItem('USE_SEMITRANSPARENT') === 'true' || false)
  const useBackgroundImage = ref(localStorage.getItem('USE_BACKGROUND_IMAGE') === 'true' || false)
  const customBackgroundImage = ref('')

  function toggleSemitransparent() {
    useSemitransparent.value = !useSemitransparent.value
    localStorage.setItem('USE_SEMITRANSPARENT', useSemitransparent.value)
  }

  function toggleBackgroundImage() {
    useBackgroundImage.value = !useBackgroundImage.value
    localStorage.setItem('USE_BACKGROUND_IMAGE', useBackgroundImage.value)

    if (!useBackgroundImage.value) {
      // 关闭壁纸时，如果半透明已开启则关闭半透明
      if (useSemitransparent.value) {
        useSemitransparent.value = false
        localStorage.setItem('USE_SEMITRANSPARENT', false)
      }
      customBackgroundImage.value = ''
    }
  }

  function setBackgroundImage(imageUrl) {
    customBackgroundImage.value = imageUrl
    useBackgroundImage.value = true
    localStorage.setItem('USE_BACKGROUND_IMAGE', true)

    // 开启壁纸时，如果半透明未开启则自动开启
    if (!useSemitransparent.value) {
      useSemitransparent.value = true
      localStorage.setItem('USE_SEMITRANSPARENT', true)
    }
  }

  return {
    useSemitransparent,
    useBackgroundImage,
    customBackgroundImage,
    toggleSemitransparent,
    toggleBackgroundImage,
    setBackgroundImage,
  }
})

// 应用配置状态
export const useAppStore = defineStore('app', () => {
  const preferences = ref({
    customTitle: 'VPS橱窗',
    customDesc: 'VPS Shop Window',
    customLogo: '',
    customNavLinks: [],
    layoutStyle: 'card',
  })

  const error = ref(null)

  function setPreferences(data) {
    preferences.value = {
      ...preferences.value,
      ...data,
    }
  }

  function setError(message) {
    error.value = message
    setTimeout(() => {
      error.value = null
    }, 5000)
  }

  return {
    preferences,
    error,
    setPreferences,
    setError,
  }
})

// 主store，组合所有子store
export const useStore = defineStore('main', () => {
  const themeStore = useThemeStore()
  const languageStore = useLanguageStore()
  const uiStore = useUIStore()
  const appStore = useAppStore()

  // 计算属性
  const currentTheme = computed(() => themeStore.currentTheme)
  const currentLanguage = computed(() => languageStore.currentLanguage)
  const useSemitransparent = computed(() => uiStore.useSemitransparent)
  const useBackgroundImage = computed(() => uiStore.useBackgroundImage)
  const customBackgroundImage = computed(() => uiStore.customBackgroundImage)
  const preferences = computed(() => appStore.preferences)
  const error = computed(() => appStore.error)

  // 方法
  function changeTheme(theme) {
    themeStore.changeTheme(theme)
  }

  function changeLanguage(language) {
    languageStore.changeLanguage(language)
  }

  function toggleSemitransparent() {
    uiStore.toggleSemitransparent()
  }

  function toggleBackgroundImage() {
    uiStore.toggleBackgroundImage()
  }

  function setBackgroundImage(imageUrl) {
    uiStore.setBackgroundImage(imageUrl)
  }

  function setPreferences(data) {
    appStore.setPreferences(data)
  }

  function setError(message) {
    appStore.setError(message)
  }

  return {
    // 状态
    currentTheme,
    currentLanguage,
    useSemitransparent,
    useBackgroundImage,
    customBackgroundImage,
    preferences,
    error,
    // 方法
    changeTheme,
    changeLanguage,
    toggleSemitransparent,
    toggleBackgroundImage,
    setBackgroundImage,
    setPreferences,
    setError,
  }
})
