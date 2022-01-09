<script>
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="退款详情" :height="50"></u-navbar>
    
    <!-- <view class="wrapper" v-if="type === 'inReview'">
      <view class="content">
        <OrderStatus :orderStatus="option.orderStatus" />
        <OrderInfo :type="'refund'" :orderStatus="option.orderStatus" class="mt-50" />
        <Creatinfo class="mt-50" />
      </view>
      <Footer>
        <view class="action-btn flex">
          <u-button class="btn" type="primary" plain="true">取消订单</u-button>
          <u-button class="btn" type="primary">支付</u-button>
        </view>
      </Footer>
    </view> -->
    <view class="wrapper">
      <!-- <view class="content">
        <OrderStatus :orderStatus="option.orderStatus" />
        <RefundInfo :orderStatus="option.orderStatus" class="mt-50" />
        <OrderInfo type="refundDetail" :orderStatus="option.orderStatus" class="mt-50" />
      </view> -->
      <Footer>
        <view class="action-btn flex">
          <view class="btn">
            <image class="call" src="@/static/icons/call.png"></image>
            <text class="contactUs">联系我们</text>
          </view>
          <!-- <u-button class="btn" type="primary">撤销申请</u-button> -->
        </view>
      </Footer>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  padding: 0 55rpx;
}

.content {
  padding: 0 $wing-gap;
  margin-top: 10rpx;
  padding-bottom: 180rpx;
}

.action-btn {
  // position: fixed;
  // bottom: 0rpx;
  // left: 36rpx;
  // right: 36rpx;
  // // width: 100%;
  // display: flex;
  // align-items: center;
  // justify-content: flex-end;
  background: #f7f7f7;
  padding: 14rpx;
  border-radius: 20rpx;
  // border-radius: 12rpx;
  // height: 100rpx;
  position: fixed;
  bottom: 40rpx;
  right: 55rpx;
  left: 55rpx;

  .btn {
    // width: 48%;
    flex: 1;
    height: 78rpx;
    // margin: 0 15rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 20rpx;

    .call {
      height: 70rpx;
      width: 70rpx;
      margin: 14rpx 0rpx 0 0;
    }

    .contactUs {
      font-size: 32rpx;
      font-weight: 500;
      color: #3995ea;
    }
  }
}
</style>
