<script>
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api'
import Card from '@/components/Card'

const vm = defineComponent({
  components: { Card },
  setup(props, { attrs }) {
    const param = toRefs(attrs)

    return {
      param,
    }
  },
})

export default vm
</script>

<template>
  <view>
    <Card class="car" v-if="$attrs.orderStatus === 'haveRefund'">
      <view class="info">
        <view class="label">
          <image class="amount" src="@/static/icons/amount-icon.png"></image>
          <text>退款总金额</text>
        </view>
        <text class="value">￥1880</text>
      </view>
      <view class="info">
        <view class="label">
          <image class="amount" src="@/static/icons/amount-icon.png"></image>
          <text>退款支付宝/微信</text>
        </view>
        <text class="value">￥1880</text>
      </view>
      <view class="reason">失败原因</view>
      <view class="rule">
        <image class="tips" src="@/static/icons/tips-icon.png"></image>
        <text>平台规则</text>
      </view>
    </Card>

    <Card class="car" v-else>
      <view class="status-label">您已成功发起退款申请，请耐心等待平台处理</view>
      <view class="status-tips"> 平台按照协议规则进行退款，审核完成发起退款，有疑问可以联系平台。 </view>
      <view class="rule">
        <image class="tips" src="@/static/icons/tips-icon.png"></image>
        <text>平台规则</text>
      </view>
    </Card>
  </view>
</template>

<style lang="scss" scoped>
.car {
  // margin-top: 50rpx;
  // margin-bottom: 30rpx;
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22rpx 0;
  font-size: 28rpx;
  color: #333;
  // border-bottom: 2px solid #f8f8f8;

  // :last-child {
  //   border-bottom: none;
  // }

  .label {
    display: flex;
    align-items: center;

    .amount {
      height: 50rpx;
      width: 50rpx;
      margin-right: 16rpx;
    }
  }
}

.reason {
  margin-top: 10rpx;
  margin-bottom: 32rpx;
  padding: 22rpx 28rpx;
  background: #f7f7f7;
  color: #666;
  font-size: 24rpx;
  border-radius: 12rpx;
}

.rule {
  display: flex;
  align-items: center;
  color: #4da0ed;
  font-size: 24rpx;

  .tips {
    height: 50rpx;
    width: 50rpx;
    margin-right: 16rpx;
  }
}

.status-labe {
  color: #333;
  font-size: 28rpx;
}

.status-tips {
  color: #999;
  font-size: 24rpx;
  margin: 16rpx 0;
}
</style>
