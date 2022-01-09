<script>
import { defineComponent, reactive, ref, toRefs, inject, computed } from '@vue/composition-api'
import Card from '@/components/Card'
import RefundTips from '@/components/RefundTips'

const orderStatusMap = {
  1: '待支付',
  1: '已支付',
  3: '申请退款中',
  4: '退款中',
  5: '申请失败',
  6: '退款完成',
  7: '已关闭',
  8: '已取消',
}

const vm = defineComponent({
  components: { Card, RefundTips },
  setup(props, { attrs }) {
    // const { orderStatus } = toRefs(attrs)

    const details = inject('orderDetails') // 获取上下文
    const orderStatus = inject('orderDetailsStatus') // 获取上下文
    console.log('orderStatus',orderStatus)
    const closeTime = computed(() => {
      console.log(new Date(details.value?.close_time * 1000))
      return (details.value?.close_time * 1000 - Date.now()) / 1000
    })
    const status = details.value?.order_status
    // const orderStatus = orderStatusMap[status] || '待支付'

    // if (orderStatus === '申请退款中' && details.value?.refund) {
    //   // TODO: 如果是退费状态且存在退款信息，做进一步判断
    // }

    return {
      closeTime,
      orderStatus,
    }
  },
})

export default vm
</script>

<template>
  <view class="warpper">
    
    <Card class="car" v-if="orderStatus === '已报名'">
      <view class="status-info">
        <view class="status-label">已支付</view>
        <view class="status-tips">恭喜您成功报名</view>
      </view>
      <image class="status-icon" src="@/static/icons/has-pay-icon.png"></image>
    </Card>
    <Card class="car" v-if="orderStatus === '待支付'">
      <view class="status-info">
        <view class="status-label">待支付</view>
        <view class="status-tips">
          还剩
          <u-count-down
            :show-hours="false"
            :show-days="false"
            :timestamp="closeTime"
            bg-color="transparent"
            color="#fff"
            separator-color="#fff"
            @end="$emit('end')"
          ></u-count-down>
          关闭订单
        </view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card>
    <Card class="car" v-if="orderStatus === '退款完成'">
      <view class="status-info">
        <view class="status-label">退款完成</view>
        <view class="status-tips">退款将1-3个工作日内退还到您的账号</view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card>
    <template v-if="orderStatus === '申请退款中'">
      <!-- <Card class="car">
        <view class="status-info">
          <view class="status-label">申请退款中</view>
          <view class="status-tips">您的退费申请审核中</view>
        </view>
        <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
      </Card> -->
      <image class="awaiting-refund" src="@/static/awaiting-refund.png" />
      <Card class="mt-30">
        <view class="main-text">您已成功发起退款申请，请耐心等待平台处理</view>
        <view class="mt-20 sub-text">平台按照协议规则进行退款，审核完成发起退款，有 疑问可以联系平台。</view>
        <RefundTips></RefundTips>
      </Card>
    </template>
    <Card class="car" v-if="orderStatus === '退款中'">
      <view class="status-info">
        <view class="status-label">退款中</view>
        <view class="status-tips">平台已打款请注意查收</view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card>
    <!-- <Card class="car" v-if="orderStatus === '退款完成'">
      <view class="status-info">
        <view class="status-label">退款成功</view>
        <view class="status-tips">您的退款金额以审核为准</view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card> -->
    <Card class="car" v-if="orderStatus === '申请失败'">
      <view class="status-info">
        <view class="status-label">退款失败</view>
        <view class="status-tips">非常抱歉，您的申请不符合退款规则，如有疑问请联系客服咨询</view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card>
    <Card class="car" v-if="orderStatus === '已关闭'">
      <view class="status-info">
        <view class="status-label">已关闭</view>
        <view class="status-tips">订单已关闭</view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card>
    <Card class="car" v-if="orderStatus === '已取消'">
      <view class="status-info">
        <view class="status-label">已取消</view>
        <view class="status-tips">订单已取消</view>
      </view>
      <image class="status-icon" src="@/static/icons/wait-pay-icon.png"></image>
    </Card>
  </view>
</template>

<style lang="scss" scoped>
.main-text {
  font-size: 30rpx;
}

.sub-text {
  font-size: 26rpx;
  color: #999;
}
.awaiting-refund {
  width: 100%;
  height: 264rpx;
}
.warpper {
  margin-bottom: 30rpx;
}
.car {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 640rpx;
  height: 220rpx;
  background: linear-gradient(318deg, #77b7f2 0%, #3794ea 100%);
  box-shadow: 0px 8px 12px #e3f2ff;

  .status-info {
    color: #fff;

    .status-label {
      margin-bottom: 5rpx;
      font-size: 40rpx;
    }

    .status-tips {
      font-size: 28rpx;
    }
  }
  .status-icon {
    width: 99rpx;
    height: 98rpx;
  }
}
</style>
