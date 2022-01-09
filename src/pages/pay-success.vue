<script>
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

export default defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {

    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const showDialog = ref(false)

    onMounted(() => {
      setTimeout(() => {
        showDialog.value = true
      }, 1000)
    })


    return {
      showDialog,
      backToIndex() {
        uni.reLaunch({ url: '/pages/tab/index' })
      },
      navigateTo,
      confirm() {
        console.log('confirm')
        showDialog.value = false
      },
      cancel() {
        console.log('cancel')
        navigateTo(`webview?title=海事一网通办&src=${encodeURIComponent('https://zwfw.msa.gov.cn/')}`)
        showDialog.value = false
      }
    }
  },
})
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="支付成功" :height="50"></u-navbar>
    <view class="w-full result">
      <view class="mt-50"></view>
      <view class="flex flex-col">
        <Icon name="checkmark-circle-fill" class="icon" :size="170" />
        <view class="mt-50 success-text">支付成功</view>
        <view class="mt-50"></view>
        <view class="mt-50"></view>
        <view class="mt-50 action-btn flex w-full">
            <u-button class="flex-1" type="primary" plain @click="backToIndex"> 回到首页</u-button>
            <u-button class="flex-1 z-0 ml-30" type="primary" @click="navigateTo('orders/list')">查看订单</u-button>
          </view>
      </view>
    </view>

    <u-modal
      v-model="showDialog"
      content="您已成功报名，考试需要您到海事一网通办平台注册"
      confirm-text="我已完成注册"
      cancel-text="前往注册账号"
      :show-cancel-button="true"
      @confirm="confirm"
      @cancel="cancel"
    >
    </u-modal>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  // padding: 50rpx $wing-gap;
  .icon {
    color: rgb(38, 128, 234);
  }

  .success-text {
    font-size: 36rpx;
    font-weight: bold;
  }
}

// .result {
//   padding-top: 60rpx;
// }

.text {
  font-size: 32rpx;
  color: #666;
  text-indent: 40rpx;
}

.image {
  width: 100%;
  margin: 20rpx 0;
}

.action-btn {
  padding: 0 60rpx;
}
</style>
