<script>
import { defineComponent, ref } from '@vue/composition-api'
import services from '@/services'

const vm = defineComponent({
  setup() {
    const showPopup = ref(false)
    const number = ref('')

    return {
      showPopup,
      number,
      call() {
        uni.makePhoneCall({
          phoneNumber: number.value,
        })
      },
      async show() {
        const res = await services['客服接口']({
          type: 1,
        })
        number.value = res?.data?.online_mobile
        showPopup.value = true
      },
    }
  },
})

export default vm
</script>

<template>
  <view @click="show">
    <slot></slot>
    <u-modal v-model="showPopup" title="" @confirm="call" :show-cancel-button="true" confirm-text="拨打">
      <view class="connect-popup mt-30 mb-50">
        <view class="mt-20 phone-value">{{ number }}</view>
        <view class="mt-20">工作日09:00-18:00</view>
      </view>
    </u-modal>
  </view>
</template>

<style lang="scss" scoped>
.connect-popup {
  text-align: center;
  color: #333;

  .phone-value {
    font-weight: 700;
  }
}
</style>
