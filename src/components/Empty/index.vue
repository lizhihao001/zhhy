<script>
import { defineComponent } from '@vue/composition-api'

const vm = defineComponent({
  props: {
    title: String,
    src: {
      type: String,
      default: () => require('@/static/no-result.png'),
    },
    text: {
      type: String,
      default: '暂无数据',
    },
  },
  setup() {},
})

export default vm
</script>

<template>
  <view class="empty-section flex-1 flex flex-col w-full">
    <image class="empty-icon" :src="src" mode="aspectFit"></image>
    <view class="empty-title mb-20" v-if="!!title">{{ title }}</view>
    <view class="empty-text">{{ text }}</view>
    <!-- <view class="desc">请重新输入关键词进行查询或稍后再查</view> -->
  </view>
</template>

<style lang="scss">
.empty-section {
  justify-content: center;

  .empty-icon {
    width: 412rpx;
    height: 346rpx;
    margin-bottom: 16rpx;
  }

  .empty-title {
    font-size: 34rpx;
    color: #888;
  }

  .empty-text {
    font-size: 30rpx;
    font-weight: 500;
    color: #aaa;
  }
}
</style>
