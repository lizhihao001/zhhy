import { computed, ref, onUnmounted, onMounted } from '@vue/composition-api'
import useLocalStorage from './useLocalStorage'
// import { uniqueId } from 'lodash'

export default function useLockSecond({ namespace, lockSecond }) {
  const storageKey = `useLockSecond:${namespace}`
  const lockUntil = useLocalStorage(storageKey)
  let timer

  const getRestSecond = () => {
    if (!lockUntil.value) {
      return 0
    }

    const now = Date.now()
    const restSecond = Math.round((lockUntil.value - now) / 1000)

    return restSecond
  }

  const isLocked = ref(false)
  const second = ref(0)

  const countdown = () => {
    const restSecond = getRestSecond()

    if (restSecond > 0) {
      isLocked.value = true
      second.value = restSecond
      timer = setTimeout(countdown, 1000)
    } else {
      isLocked.value = false
      second.value = 0
      lockUntil.value = undefined
    }
  }

  onMounted(countdown)

  onUnmounted(() => {
    clearTimeout(timer)
  })

  return {
    isLocked,
    restSecond: second,
    lock() {
      lockUntil.value = Date.now() + lockSecond * 1000
      countdown()
    },
    reset() {
      lockUntil.value = undefined
      clearTimeout(timer)
    },
  }
}
