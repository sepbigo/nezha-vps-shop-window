/**
 * 获取系统设置
 * @returns {Promise<Object>} 系统设置对象
 * @throws {Error} 当API请求失败时抛出错误
 */
export const getSetting = async () => {
  try {
    const response = await fetch('/api/v1/setting')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('获取系统设置失败:', error)
    return {
      data: {
        config: {
          custom_code: '',
        },
      },
    }
  }
}
