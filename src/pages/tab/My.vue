<script>
import { defineComponent, reactive, computed, onMounted, onActivated } from '@vue/composition-api'
import { useMouse } from '@vueuse/core'
import { useStore } from '@/hooks'
import get from 'lodash/get'

const vm = defineComponent({
  onLoad() {
    console.log('main onLoad')
    // pages/set/index
  },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const userProfile = computed(() => store.state?.user?.profile ?? {})
    const state = reactive({
      count: 0,
    })

    const add = () => {
      state.count++
    }

    const toLogin = () => {
      uni.redirectTo({
        url: '/pages/login',
      })
    }

    onMounted(() => store.dispatch('user/fetchProfile'))
    onActivated(() => store.dispatch('user/fetchProfile'))

    return {
      get,
      state,
      add,
      toLogin,
      store,
      userInfo,
      userProfile,
      title: '我的',
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      notReady() {
        uni.showToast({ icon: 'none', title: '未就绪' })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <view class="head">
      <image class="set" src="@/static/icons/set.png" @click="navigateTo('set/index')"></image>
      <text class="set-text">设置</text>
    </view>
    <view class="info" @click="navigateTo('set/set-base-info')">
      <image
        class="avatar"
        :src="get($store, 'state.user.profile.avatar')"
        v-if="get($store, 'state.user.profile.avatar')"
      ></image>
      <image class="avatar" src="@/static/detault-avatar.png" v-else></image>
      <text class="name">{{ get($store, 'state.user.profile.name', '--') || '--' }}</text>
      <text class="title-name">{{ get($store, 'state.user.profile.job_name', '--') || get($store, 'state.user.profile.mobile', '--')  }}</text>
    </view>
    <view class="payment">
      <view class="payment-left">
        <image class="left-img" src="../../static/payment.png" mode=""></image>
        <view class="main">
          <text class="stay">待付款</text>
          <text class="time">剩余时间 01:30:00</text>
        </view>
      </view>
      <view class="payment-right">
        <image class="payment-right-img" src="../../static/quzhifu.png" mode=""></image>
        <text class="payment-right-zf">去支付</text>
      </view>
    </view>
    <view class="entry">
      <view class="item" @click="navigateTo('orders/list')">
        <image class="icons" src="@/static/icons/order.png"></image>
        <text class="label">我的订单</text>
      </view>
      <view class="item" @click="navigateTo('cert-center/list')">
        <image class="icons" src="@/static/icons/credential-center.png"></image>
        <text class="label">证书中心</text>
      </view>
      <view class="item" @click="navigateTo('course-manage/index')">
        <image class="icons" src="@/static/icons/manage.png"></image>
        <text class="label">课程管理</text>
      </view>
      <view class="item" @click="navigateTo('recommend/list')">
        <image class="icons" src="@/static/icons/recommend-job.png"></image>
        <text class="label">推荐就业</text>
      </view>
      <view class="item" @click="navigateTo('collection-list')">
        <image class="icons" src="@/static/icons/collect.png"></image>
        <text class="label">我的收藏</text>
      </view>
      <view class="item" @click="navigateTo('tab/Coupons')">
        <image class="icons" src="@/static/icons/quanbao.png"></image>
        <text class="label">我的券包</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.payment {
  background: #e1f3ff;
  opacity: 1;
  padding: 22rpx;
  display: flex;
  justify-content: space-between;
  border-radius: 20rpx;
  margin-top: 50rpx;
  .payment-left {
    display: flex;
    .left-img {
      width: 120rpx;
      height: 120rpx;
    }
    .main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 50rpx 0 22rpx;
      .stay {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 44rpx;
        color: #333333;
        padding-bottom: 14rpx;
      }
      .time {
        font-size: 30rpx;
        font-weight: 400;
        line-height: 42rpx;
        color: #3995ea;
      }
    }
  }
  .payment-right {
    display: flex;
    align-items: center;
    padding-top: 10rpx;
    position: relative;
    .payment-right-img {
      width: 176rpx;
      height: 96rpx;
    }
    .payment-right-zf {
      font-size: 28rpx;
      font-weight: 500;
      line-height: 40rpx;
      color: #ffffff;
      opacity: 1;
      position: absolute;
      top: 38rpx;
      right: 48rpx;
    }
  }
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('@/static/my-bg.png');
  background-position: top left;
  background-size: 100%;
  background-repeat: no-repeat;
  position: relative;
  top: calc(var(--status-bar-height) * -1);
  padding-top: var(--status-bar-height);
}

.head {
  display: flex;
  // align-items: center;
  // justify-content: flex-end;
  flex-direction: column;
  align-items: flex-end;
  /* height: 20px; */
  width: 100%;
  padding: 34rpx 42rpx;
  .set {
    width: 45rpx;
    height: 40rpx;
    padding-right: 2rpx;
  }
  .set-text {
    font-size: 24rpx;
    font-weight: 400;
    color: #333333;
  }
}

.info {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48rpx;
}

.avatar {
  width: 162rpx;
  height: 162rpx;
  border-radius: 50%;
}

.name {
  margin-top: 14rpx;
  font-size: 36rpx;
}

.title-name {
  margin-top: 18rpx;
  /* width: 154rpx; */
  /* height: 58rpx; */
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  background: #f0f8ff;
  opacity: 1;
  border-radius: 40rpx;
  display: flex;
  align-content: center;
  justify-content: center;
  color: #429aeb;
}

.entry {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  opacity: 1;
  margin: 60rpx 0;
  width: 640rpx;
  border-radius: 20rpx;
}

.item {
  width: 33.33%;
  height: 220rpx;
  // margin: 46rpx 55rpx;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.icons {
  width: 96rpx;
  height: 96rpx;
  margin-bottom: 10rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
}
</style>
