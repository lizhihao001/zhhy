import { ref } from '@vue/composition-api'

import useLocalStorage from './useLocalStorage'

export default function useService(
  fetchMethod,
  { initialData = null, presistKey, needErrorToast = true, dataFilter = (data) => data } = {},
) {
  const loading = ref(false)
  const data = presistKey ? useLocalStorage(presistKey, initialData) : ref(initialData)
  const msg = ref('')

  const fetch = async (...args) => {
    loading.value = true
    const res = await fetchMethod(...args)
    loading.value = false

    if (needErrorToast && !res?.success) {
      uni.showToast({
        icon: 'none',
        title: res?.msg ?? '请求错误，稍后再试',
      })
    }

    // if (res?.success) {
    data.value = dataFilter(res?.data) ?? initialData
    // }

    msg.value = res?.msg

    return res
  }

  return {
    loading,
    data,
    msg,
    fetch,
  }
}
