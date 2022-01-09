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
    <view class="notice" @click="toDtails">
      <view class="notice-title">
        <view class="message-title">
          <text class="title" :class="{ unread: item.read_flag !== 1 }">{{ item.message_title }}</text>
        </view>
        <image class="arrow" src="@/static/arrow.png"></image>
      </view>
      <view class="notice-content">
        <image class="notice-content-img" :src="item.image" mode="aspectFill" v-if="!!item.image"></image>
        <!-- <view class="notice-info" v-html="item.message_content"></view> -->
        <u-parse class="notice-info" :html="item.message_content"></u-parse>
      </view>
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

.arrow {
  width: 14rpx;
  height: 27rpx;
}

.notice {
  background: #ffffff;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  opacity: 1;
  border-radius: 24rpx;
  padding: 20rpx 30rpx;
  width: 100%;
}

.notice-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #f6f7fb;
  margin-bottom: 28rpx;
}

.notice-content {
  display: flex;
  align-items: center;
}

.notice-content-img {
  width: 170rpx;
  height: 166rpx;
  border-radius: 20rpx;
}

.notice-info {
  padding-left: 16rpx;
  font-size: 28rpx;
  color: #999;
  flex: 1;
  height: 152rpx;
  background: #f7f7f8;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
}
</style>
