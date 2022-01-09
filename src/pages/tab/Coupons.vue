<script>
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="优惠券" :height="50"></u-navbar>
    <view class="list">
      <view class="left">
        <image class="img" src="@/static/icons/quan.png">
        <text class="Coupons">立减50</text>
      </view>
      <image class="right-img" src="@/static/icons/xuanzhong.png">
    </view>

    <view class="list">
      <view class="left">
        <image class="img" src="@/static/icons/quan.png">
        <text class="Coupons">满300立减50</text>
        <text class="no">（不可使用）</text>
      </view>
      <image class="right-img active" src="@/static/icons/weixuanzhong.png">
    </view>
  </view>
</template>
<style scoped lang="scss">
.content {
  padding: 60rpx 54rpx;
  .list {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
    border-radius: 20rpx;
    padding: 0rpx 35rpx;
    height: 100rpx;
    margin-bottom: 40rpx;
    display: flex;
    justify-content: space-between;
    position: relative;
    .left {
      display: flex;
      padding-top: 30rpx;
      .img {
        width: 48rpx;
        height: 43rpx;
      }
      .Coupons {
        font-size: 32rpx;
        color: #666666;
        padding-left: 20rpx;
      }
      .no {
        color: #999999;
        font-size: 26rpx;
        padding-top: 4rpx;
      }
    }

    .right-img {
      width: 76rpx;
      height: 76rpx;
      padding-top: 14rpx;
      &.active{
          width: 40rpx;
          height: 40rpx;
          position: absolute;
          right: 52rpx;
          top: 20rpx;
      }
    }
  }
}
</style>