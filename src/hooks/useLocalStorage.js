import { useStorage } from '@vueuse/core'

export default function useLocalStorage(key, defaultValue, options = {}) {
  const userInfo = uni.getStorageSync('userInfo') ?? {}
  const userName = userInfo?.username
  const uniStorage = {
    getItem: (key) => uni.getStorageSync(key),
    setItem: (key, value) => uni.setStorageSync(key, value),
    removeItem: (key) => uni.removeStorageSync(key),
  }

  return useStorage(key, defaultValue, uniStorage, options)
}
