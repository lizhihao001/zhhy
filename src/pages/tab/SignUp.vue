<script>
import { defineComponent, reactive } from '@vue/composition-api'
import { useMouse } from '@vueuse/core'
import TrainTypeList from '@/components/TrainTypeList'

const vm = defineComponent({
  components: { TrainTypeList },
  onLoad() {
    console.log('main onLoad')
  },
  setup() {
    const state = reactive({
      count: 0,
    })

    const add = () => {
      state.count++
    }

    const toLogin = () => {
      uni.navigateTo({
        url: '/pages/login',
      })
    }

    return {
      state,
      add,
      toLogin,
      title: '报名',
      handleTypeSelected(type) {
        uni.setStorageSync('train-list-type', type)
        uni.navigateTo({
          url: `/pages/train/list`,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view>
    <TrainTypeList @change="handleTypeSelected"> </TrainTypeList>
  </view>
</template>

<style lang="scss" scoped></style>
