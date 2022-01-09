<template>
  <u-loading mode="flower" :size="30" v-if="loading"></u-loading>
  <text v-else>{{ videoTime }}</text>
</template>

<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import { useService } from '@/hooks'
import services from '@/services'

const fix0 = Array.from({ length: 10 }, (_, i) => `0${i}`)
const formatTime = (t) => {
  let h = t / 3600
  let m = (h - Math.floor(h)) * 60
  let s = (m - Math.floor(m)) * 60
  h = Math.floor(h).toString()
  m = Math.floor(m).toString()
  s = Math.floor(s).toString()

  return `${fix0[h] ?? h}:${fix0[m] ?? m}:${fix0[s] ?? s}`
}

// https://www.freesion.com/article/44181436304/
const getVideoTime = (src = '') =>
  new Promise((resolve) => {
    const storageKey = `video_long_${src}`
    const cache = uni.getStorageSync(storageKey)

    if (cache) {
      resolve(cache)
      return
    }

    let audioContext = uni.createInnerAudioContext()
    audioContext.volume = 0
    audioContext.autoplay = true
    audioContext.src = src
    // 必须写在onCanplay里面，否则获取不到
    audioContext.onCanplay(() => {
      audioContext.duration
      audioContext.buffered
      //如果不写上面2行，打印audioContext，duration，buffered都有值，但打印audioContext.duration或audioContext.buffered值为0
      setTimeout(() => {
        if (audioContext.duration * 1 > 0 || audioContext.buffered * 1 > 0) {
          // 部分iphone手机audioContext.duration 会为为0，所以判断audioContext.duration是否为0
          const result = formatTime(
            parseInt(audioContext.duration == 0 ? audioContext.buffered : audioContext.duration, 10),
          )
          uni.setStorageSync(storageKey, result)
          resolve(result)
        }
      }, 1000)
    })
  })

const vm = defineComponent({
  props: {
    id: '',
  },
  setup(props) {
    const videoTime = ref('00:00:00')
    const loading = ref(true)
    const videoUrl = ref('')
    onMounted(async () => {
      loading.value = true
      const res = await services['学习资料详情']({
        video_id: props.id,
      })

      const src = `http://zhschool.qixiuu.com${res?.data?.video_url}`
      console.log('src===',src)
      const time = await getVideoTime(src)
      videoTime.value = time
      loading.value = false
      videoUrl.value = src;
    })

    return {
      loading,
      videoTime,
      videoUrl
    }
  },
})

export default vm
</script>
