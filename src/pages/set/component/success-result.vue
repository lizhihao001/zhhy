<script>
import { defineComponent } from '@vue/composition-api'
import { useStore } from '@/hooks'

const vm = defineComponent({
  props: {
    text: String,
  },
  setup() {
    const store = useStore()
    return {
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      logout() {
        store.commit('user/userInfo', {})
        store.commit('user/token', '')

        uni.reLaunch({
          url: '/pages/auth/login-type',
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="result-view flex flex-col">
    <image class="result-icon" src="@/static/icons/success-icon.png"></image>
    <text class="result-text">操作成功</text>
    <text>{{ text }}</text>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full action">
      <u-button type="primary" class="mt-30" @click="logout" size="medium">重新登录</u-button>
      <!-- <u-button type="primary" class="mt-30" plain @click="navigateTo('auth/pwd-login')">密码登录</u-button> -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.result-view {
  width: 100%;
  font-size: 32rpx;
  color: #999;

  .result-icon {
    width: 180rpx;
    height: 180rpx;
    margin-bottom: 32rpx;
  }

  .result-text {
    font-size: 40rpx;
    font-weight: 700;
    color: #3f454e;
    margin-bottom: 20rpx;
  }
}

.action {
  .u-btn {
    width: 100%;
    height: 100rpx;
    border-radius: $card-border-radius;
    // box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
  }
}
</style>
