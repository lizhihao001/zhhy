<script>
import { defineComponent, ref } from '@vue/composition-api'
import services from '@/services'

const vm = defineComponent({
  setup() {
    const showPopup = ref(false)
    const number = ref('')

    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    return {
      navigateTo,
      showPopup,
      number,
      async show() {
        const res = await services['客服接口']({
          type: 1,
        })
        navigateTo(`webview?title=在线咨询&src=${encodeURIComponent(res?.data?.online_service)}`)
      },
    }
  },
})

export default vm
</script>

<template>
  <view @click="show">
    <slot></slot>
    <!-- <u-modal v-model="showPopup" title="">
      <view class="connect-popup mt-30 mb-50">
        <view class="mt-20 phone-value">{{ number }}</view>
        <view class="mt-20">工作日09:00-18:00</view>
      </view>
    </u-modal> -->
  </view>
</template>

<style lang="scss" scoped>
// .connect-popup {
//   text-align: center;
//   .phone-value {
//     font-weight: 700;
//   }
// }
</style>
