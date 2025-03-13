/**
 * 默认的偏好设置
 */
const DEFAULT_PREFERENCES = {
  customBackgroundImage: '',
  customLogo: '',
  customTitle: 'VPS橱窗',
  customDesc: 'VPS Shop Window',
  customTheme: 'system',
  customLanguage: 'zh-CN',
  useSemitransparent: false,
  customNavLinks: [],
}

/**
 * 处理外部资源
 * @param {string} url - 资源URL
 * @param {string} type - 资源类型 ('css' 或 'js')
 * @returns {Promise} 资源加载Promise
 */
const loadExternalResource = (url, type) => {
  return new Promise((resolve, reject) => {
    let element
    if (type === 'css') {
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.href = url
    } else if (type === 'js') {
      element = document.createElement('script')
      element.src = url
    }

    if (element) {
      element.crossOrigin = 'anonymous'
      element.onload = resolve
      element.onerror = reject
      document.head.appendChild(element)
    } else {
      reject(new Error('Unsupported resource type'))
    }
  })
}

/**
 * 解析自定义配置代码中的偏好设置和资源
 * @param {string} customCode - 自定义HTML配置代码
 * @returns {Object} 解析后的偏好设置和资源
 */
export const parsePreferences = async (customCode) => {
  try {
    if (!customCode) return { preferences: DEFAULT_PREFERENCES }

    const domparser = new DOMParser()
    const dom = domparser.parseFromString(customCode, 'text/html')

    // 解析脚本
    const scripts = Array.from(dom.querySelectorAll('script'))
    let preferences = { ...DEFAULT_PREFERENCES }

    await Promise.all(
      scripts.map(async (script) => {
        const scriptLang = script.getAttribute('lang')
        const scriptRel = script.getAttribute('rel')

        if (scriptLang === 'json' && scriptRel === 'preferences') {
          try {
            const parsedPrefs = JSON.parse(script.innerHTML || '{}')
            preferences = { ...preferences, ...parsedPrefs }
          } catch (error) {
            console.error('解析JSON配置失败:', error)
          }
        } else if (scriptLang === 'json' && scriptRel === 'resource') {
          try {
            const resources = JSON.parse(script.innerHTML || '[]')
            await Promise.all(
              resources.map((res) => {
                if (res.endsWith('css')) {
                  return loadExternalResource(res, 'css')
                } else if (res.endsWith('js')) {
                  return loadExternalResource(res, 'js')
                }
              }),
            )
          } catch (error) {
            console.error('加载外部资源失败:', error)
          }
        } else {
          // 处理普通脚本
          const scriptElement = document.createElement('script')
          scriptElement.innerHTML = script.innerHTML
          document.head.appendChild(scriptElement)
        }
      }),
    )

    // 处理样式
    const styles = Array.from(dom.querySelectorAll('style'))
    await Promise.all(
      styles.map((style) => {
        const styleElement = document.createElement('style')
        styleElement.innerHTML = style.innerHTML
        document.head.appendChild(styleElement)
        return Promise.resolve()
      }),
    )

    return { preferences }
  } catch (error) {
    console.error('解析配置失败:', error)
    return { preferences: DEFAULT_PREFERENCES }
  }
}

/**
 * 应用偏好设置到本地存储和UI状态
 * @param {Object} preferences - 偏好设置对象
 */
const applyPreferences = (preferences) => {
  // 处理背景图片设置
  if (preferences.customBackgroundImage) {
    localStorage.setItem('USE_BACKGROUND_IMAGE', 'true')
    localStorage.setItem('CUSTOM_BACKGROUND_IMAGE', preferences.customBackgroundImage)
  }

  // 处理半透明设置
  if (preferences.useSemitransparent) {
    localStorage.setItem('USE_SEMITRANSPARENT', 'true')
  }

  // 处理主题设置
  if (preferences.customTheme && !localStorage.getItem('vueuse-color-scheme')) {
    localStorage.setItem('vueuse-color-scheme', preferences.customTheme)
  }

  // 处理语言设置
  if (preferences.customLanguage && !localStorage.getItem('VITE_DEFAULT_LOCALE')) {
    localStorage.setItem('VITE_DEFAULT_LOCALE', preferences.customLanguage)
  }
}

/**
 * 获取系统设置
 * @returns {Promise<Object>} 系统设置对象，包含解析后的偏好设置
 */
export const getSetting = async () => {
  try {
    const response = await fetch('/api/v1/setting')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // 解析自定义配置中的偏好设置和资源
    const { preferences } = await parsePreferences(data?.data?.config?.custom_code)

    // 应用偏好设置
    applyPreferences(preferences)

    return {
      ...data,
      preferences,
    }
  } catch (error) {
    console.error('获取系统设置失败:', error)
    return {
      data: {
        config: {
          custom_code: '',
        },
      },
      preferences: DEFAULT_PREFERENCES,
    }
  }
}
