<script>
import { defineComponent, computed, toRefs } from '@vue/composition-api'

const vm = defineComponent({
  props: {
    item: Object,
  },
  setup(props, { attrs }) {
    const toDtails = () => {
      console.log(props.item.id)
      uni.navigateTo({
        url: `/pages/message/details?id=${props.item.id}`,
      })
    }

    return {
      toDtails,
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <view class="receive-time">{{ item.update_time_text }}</view>
    <view class="message" @click="toDtails">
      <view class="message-content">
        <view class="message-title">
          <text class="title" :class="{ unread: item.read_flag !== 1 }">{{ item.message_title }}</text>
        </view>
        <u-parse class="message-info" :html="item.message_content"></u-parse>
        <!-- <view class="message-info" v-html="item.message_content"></view> -->
      </view>
      <image class="arrow" src="@/static/arrow.png"></image>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}

.receive-time {
  color: #bec2cb;
  font-size: 24rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 20rpx;
  margin-top: 40rpx;
}

.message {
  background: #ffffff;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  opacity: 1;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 30rpx;
  width: 100%;
}

.message-content {
  flex: 1;
}

.title {
  font-size: 32rpx;
  color: #333;
  position: relative;

  &.unread {
    &::after {
      top: 0;
      right: -16rpx;
      content: '';
      position: absolute;
      width: 16rpx;
      height: 16rpx;
      background: #ef3124;
      border-radius: 50%;
    }
  }
}

.message-info {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  overflow: hidden;
}

.arrow {
  width: 14rpx;
  height: 27rpx;
}
</style>
