<script>
import { defineComponent, reactive } from '@vue/composition-api'

const vm = defineComponent({
  props: {
    item: Object,
  },

  setup(props) {
    const toDetails = () => {
      uni.navigateTo({
        url: `/pages/news-list/details?id=${props.item.id}`,
      })
    }

    return {
      toDetails,
    }
  },
})

export default vm
</script>

<template>
  <view class="item" @click="toDetails">
    <view class="content">
      <view class="title">{{ item.title }}</view>
      <view class="date">{{ item.create_time }}</view>
    </view>
    <image class="img" :src="`http://zhschool.qixiuu.com${item.images}`" mode="aspectFill"></image>
  </view>
</template>

<style lang="scss" scoped>
.item {
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #f8f8f8;

  .content {
    margin-right: 46rpx;
    flex: 1;

    .title {
      color: #333;
      font-size: 28rpx;
    }

    .date {
      margin-top: 16rpx;
      padding: 8rpx 22rpx;
      // width: 186rpx;
      height: 52rpx;
      display: inline-block;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      color: #666;
      font-size: 24rpx;
      background: #f7f8fa;
      opacity: 1;
      border-radius: 8rpx;
    }
  }

  .img {
    width: 168rpx;
    height: 126rpx;
    border-radius: 12rpx;
    // object-fit: cover;
  }
}
</style>
